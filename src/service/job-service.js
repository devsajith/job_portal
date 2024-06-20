const Company = require('../model/company-model');
const hotJob = require('../model/hotJobs-model');
const Job = require('../model/jobs-model')
const tag = require('../model/tag-model');
const Industry = require('../model/industry.model')
const Salary = require('../model/salary-model')
const logger = require('../utils/logger-util');
const subCategory = require('../model/subCategory-model');
const Category = require('../model/category-model');
const employeeType = require('../model/employementType-model');
const prefecture = require('../model/prefecture-model');
const highLevelLocation = require('../model/highLevelLocation-model');
const skill = require('../model/skill-model')
const JobCategoryDetailModel = require('../model/jobCategoryDetail.model')
const SkillDetailModel = require('../model/skillDetail.model')
const TagConnectionModel = require('../model/tagConnection.model')
const subCategoryType = require('../types/subCategory-type');
const categoryType = require('../types/category-type');
const highLevelLocationType = require('../types/highLevelLocation-type');
const prefectureType = require('../types/prefecture-type');
const skillType = require('../types/skill-type');
const industryType = require('../types/industry-type');
const salaryType = require('../types/salaryRange-type');
const { NotFound, InternalServerError, BadRequest } = require('../utils/errors');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');

const pager = require('../utils/paginate');
const JobType = require('../types/job-type');
const JobListView = require('../view/job-list.view');
const jobType = require('../types/job-type');

const listhotJobAll = async () => {
    logger.info("fetching hot jobs ")
    let data = await hotJob.findAll({
        order: [["created_date", "DESC"]],
        attributes: [['hot_job_id', 'hotJobId']],
        include: [{
            model: Job,

            where: { status: jobType.Published },
            attributes: [['job_id', 'jobId'], ['job_title', 'jobName'], ['description', 'description']],
            include: [{
                model: tag,

                attributes: [['tag_id', 'tagId'], ['tag_name', 'tagName']],
                through: {
                    attributes: []
                }
            },
            {
                model: prefecture,
                attributes: [['prefecture_id', 'prefectureId'], ['prefecture_name', 'prefectureName']],
            },
            {
                model: Salary,
                as: "salaryRange",
                attributes: [['min_salary', 'minimumSalary'], ['max_salary', 'maximumSalary']],
            },
            {
                model: Company,
                where: { status: 1 },
                attributes: [['company_id', 'companyId'], ['name', 'companyName'], ['catch_phrase', 'catchPhrase']],
                include: [{
                    model: Industry,
                    as: "industry",
                    attributes: [['industry_id', 'industryId'], ['name', 'industryName']],

                },
                {
                    model: prefecture,
                    as: 'prefectures',
                    attributes:
                        [
                            ['prefecture_id', 'prefectureId'],
                            ['prefecture_name', 'prefectureName']
                        ],
                },
                ],

            }],
        }],

    },
    );
    if (data) {
        return data;
    }
};

const listJobAll = async () => {
    let data = await Job.findAll({
        include: [{
            model: tag,
        }],
        where: { status: JobType.Published }
    },
    );
    if (data) {
        return data;
    }
};
const listjobdetailsWithbullhorn = async (jobId) => {
    console.log(jobId)
    logger.info("fetching job  with bullhorn id corresponding to id" + jobId)
    let data = await Job.findByPk(jobId, {

        attributes: [['job_id', 'JobId'], ['status', 'status'], ['bullhorn_id', 'bullhorn_id'],],
        where: { status: JobType.Published }
    })
    if (data) {

        return data
    }
    else {
        throw new NotFound(26201, 'Job Not found');
    }



}

const listjobdetails = async (jobId) => {
    logger.info("fetching job  corresponding to id" + jobId)
    let data = await Job.findOne({
        where: {
            status: JobType.Published,
            job_id: jobId
        },
        attributes: [['job_id', 'JobId'], ['job_title', 'JobName'], ['description', 'description'], ['holiday', 'holiday'], ['conditions', 'conditions'], ['benefits', 'benefits'], ['comments', 'comments'], ['working_hours', 'workingHours'], ['updated_date', 'updatedDate']],
        include: [{
            model: tag,
            attributes: [['tag_id', 'tagId'], ['tag_name', 'tagName']],
            through: {
                attributes: []
            }
        }, {
            model: skill,

            attributes: [['skill_id', 'skillId'], ['skill_title', 'skillName']],
            through: {
                attributes: []
            }
        },
        {
            model: Company,
            attributes: [['company_id', 'companyId'], ['name', 'companyName'], ['capital', 'capital'], ['company_url', 'companyURL'], ['catch_phrase', 'catchPhrase'], ['headquarters_location', 'headquartersLocation']],
            include: [{
                model: Industry,
                as: "industry",
                attributes: [['industry_id', 'industryId'], ['name', 'industryName']],
            },
            {
                model: prefecture,
                as: 'prefectures',
                attributes:
                    [
                        ['prefecture_id', 'prefectureId'],
                        ['prefecture_name', 'prefectureName']
                    ],
            },

            ]

        },
        {
            attributes: [['employement_type_id', 'employementTypeId'], ['employement_type', 'employementType']],
            model: employeeType,

        },
        {
            model: prefecture,
            attributes: [['prefecture_id', 'prefectureId'], ['prefecture_name', 'prefectureName']],

        },

        {
            model: Salary,
            as: "salaryRange",
            attributes: [['salary_range_id', 'salaryRangeId'], ['min_salary', 'minSalary'], ['max_salary', 'maxSalary'],],

        }, {
            model: subCategory,
            as: "jobSubCategory",
            attributes: [['job_sub_category_id', 'jobSubCategoryId'], ['name', 'subcategoryName']],
            through: {
                attributes: []
            },
            include: [{
                model: Category,
                attributes: [['category_id', 'categoryId'], ['name', 'categoryName']],
            },]

        }],

    },
    );
    if (data) {
        return data;
    }
    else {
        throw new NotFound(26201, 'Job Not found');
    }
};

const listRelatedJobs = async (categories, jobId) => {
    logger.info("fetching related jobs ")
    let data = await Job.findAll({
        attributes: [['job_id', 'jobId'], ['job_title', 'jobName'], ['description', 'description']],
        include: [{
            model: tag,

            attributes: [['tag_id', 'tagId'], ['tag_name', 'tagName']],
            through: {
                attributes: []
            }
        },
        {
            model: subCategory,
            as: "jobSubCategory",
            attributes: [],
            through: {
                attributes: []
            },
            where: {
                job_sub_category_id: { [Op.in]: categories }
            }
        },
        {
            model: prefecture,
            attributes: [['prefecture_id', 'prefectureId'], ['prefecture_name', 'prefectureName']],
        },
        {
            model: Salary,
            as: "salaryRange",
            attributes: [['min_salary', 'minimumSalary'], ['max_salary', 'maximumSalary']],
        },
        {
            model: Company,
            attributes: [['company_id', 'companyId'], ['name', 'companyName'], ['catch_phrase', 'catchPhrase']],
            include: [{
                model: Industry,
                as: "industry",
                attributes: [['industry_id', 'industryId'], ['name', 'industryName']],

            },
            {
                model: prefecture,
                as: 'prefectures',
                attributes:
                    [
                        ['prefecture_id', 'prefectureId'],
                        ['prefecture_name', 'prefectureName']
                    ],
            },],

        }],
        where: {
            job_id: { [Op.not]: jobId },
            status: jobType.Published
        },
        limit: 5,
    },
    );
    if (data) {
        return data;
    }
};

const getJobList = async (requestParams) => {
    //setting default page parameters 
    let pageNo = 1, pageSize = 10;

    //validating page parameters
    if (requestParams.pageNo)
        pageNo = requestParams.pageNo;
    if (Number.isInteger(parseInt(requestParams.limit)))
        pageSize = requestParams.limit;

    //creating where clause
    logger.info("Creating job list query");
    let where = [];
    where.push({
        status: JobType.Published
    });


    if (requestParams.freeText) {
        where.push({
            [Op.or]: {
                job_title: {
                    [Op.like]: `%${requestParams.freeText}%`,
                },
                description: {
                    [Op.like]: `%${requestParams.freeText}%`,
                }
            }
        });

    }

    //adding prefecture and area          
    let prefectureList = [];
    if (requestParams.prefecture)
        for (let place of requestParams.prefecture.split(','))
            prefectureList.push(parseInt(place))


    //Adding high level area
    if (requestParams.area) {
        let areaList = [];
        for (let area of requestParams.area.split(','))
            areaList.push(parseInt(area));

        let areas = await prefecture.findAll({
            attributes: ['prefecture_id'],
            where: {
                status: prefectureType.ACTIVE,
                high_level_location_Id: {
                    [Op.in]: areaList
                }
            }
        });

        for (let area of areas)
            if (!prefectureList.includes(parseInt(area.prefecture_id)))
                prefectureList.push(parseInt(area.prefecture_id))

    }

    logger.info(`Fetching prefecture list from DB ${prefectureList}`);

    //Adding prefeture condition in where clause
    if (requestParams.area || requestParams.prefecture) {
        logger.info(`Adding prefecture to where clause`);
        where.push({
            prefecture_id: { [Op.in]: prefectureList }
        });
    }


    //Adding categories to clause
    let categoryList = []
    let subList = [];
    if (requestParams.jobCategory) {
        for (let category of requestParams.jobCategory.split(',')) {
            categoryList.push(parseInt(category));
        }

        let categories = await subCategory.findAll({
            where: {
                status: subCategoryType.ACTIVE,
                category_id: {
                    [Op.in]: categoryList
                }
            }
        })

        for (let category of categories) {
            subList.push(category.job_sub_category_id);
        }
    }

    //Adding skill to clause
    let skillList = []
    if (requestParams.skillList) {
        for (let skillObj of requestParams.skillList.split(',')) {
            skillList.push(parseInt(skillObj));
        }
        logger.info(`Skill list from api req  ${skillList}`);
        let skillDbObjs = await SkillDetailModel.findAll({
            where: {
                skill_id: {
                    [Op.in]: skillList
                }
            }
        })

        for (let skillDbObj of skillDbObjs) {
            skillList.push(skillDbObj.job_id);
        }
    }
    logger.info(`Skill list from DB ${skillList}`);
    let subCategoryList = subList;
    let jobSubCategoryIdlist = [];
    if (requestParams.jobSubCategory) {
        for (let category of requestParams.jobSubCategory.split(',')) {
            if (!subCategoryList.includes(parseInt(category)))
                subCategoryList.push(parseInt(category));
        }
        logger.info(`Total sub category list  from api req  ${subCategoryList}`);

        let jobSubCategoryDetaillist = await JobCategoryDetailModel.findAll({
            where: {
                job_sub_category_id: {
                    [Op.in]: subCategoryList
                }
            }
        })
        for (let jobSubCategoryDetail of jobSubCategoryDetaillist) {
            jobSubCategoryIdlist.push(jobSubCategoryDetail.job_id);
        }



    }


    let include = [

        {
            model: prefecture,
            attributes: ['prefecture_name']
        }
    ];

    let salaryInclude = {};
    salaryInclude.model = Salary;
    salaryInclude.as = "salaryRange";
    salaryInclude.attributes = ['min_salary', 'max_salary'];
    let salaryWhere = {}
    let salaryCheck = {};
    console.log( "requestParams.minSalary: ",requestParams.minSalary)
    if (requestParams.minSalary) {
        logger.info(`Check for  salary added`);
        salaryCheck.max_salary = {
            [Op.gte]: requestParams.minSalary
        }
        salaryWhere = {
            [Op.or]: {
                [Op.and]: salaryCheck,
                max_salary: {
                    [Op.in]: [0, 1]
                }
            }
        }
        salaryInclude.where = salaryWhere;
    }


    include.push(salaryInclude);

    //Adding company and industries
    let companyInclude = {
        model: Company,
        attributes: ['company_id', 'name', `industry_id`, `catch_phrase`],
        include: [{
            model: Industry,
            as: "industry",
            attributes: ['industry_id', 'name'],


        }]
    }

    if (requestParams.industries)
        companyInclude.where = {

            industry_id: {
                [Op.in]: requestParams.industries
            }

        }
    include.push(companyInclude);

    //Adding subcategory in query
    // if (subCategoryIncude.model) {
    //     include.push(subCategoryIncude);
    // }
    let jobIdList = [];

    jobIdList.push(...jobSubCategoryIdlist);
    if (skillList.length != 0) {
        if (!(requestParams.jobSubCategory || requestParams.jobCategory)) {
            logger.info("Category List from DB is empty ")
            jobIdList = skillList
        }
        else {
            logger.info("Combining jobids matching skill and job categories")
            jobIdList = jobIdList.filter((jobId) => {

                return (skillList.indexOf(jobId) > -1)

            })

        }
    }

    if (requestParams.jobSubCategory || requestParams.skillList || requestParams.jobCategory) {
        logger.info(`Check added for job category or skill ${jobIdList}`)
        where.push({
            job_id: {
                [Op.in]: jobIdList
            }
        })
    }

    let jobList = [];

    let sortList = [
        ['updated_date', 'DESC'],
        ['job_id', 'DESC']
    ]
    let hascreatedDate = false;
    if (requestParams.createdDate) {
        where.push({
            created_date: {
                [Op.gte]: requestParams.createdDate
            },
        })
        if (jobIdList.length != 0) {
            where.push({
                job_id: {
                    [Op.in]: jobIdList,
                    [Op.gt]: requestParams.jobId
                }
            })
        }
        else {
            where.push({
                job_id: {
                    [Op.gt]: requestParams.jobId
                },
            })
        }
        jobList = await Job.findAll({
            limit: pageSize + 1,
            include: include,
            where: where,
            order: sortList
        });
        hascreatedDate = true;

    }
    else {
        logger.info(`Inside else jobList = [] before errorrrrrrrrrrrrrrrrrrrrrrr after`,jobList);

        jobList = await Job.findAll({
            offset: ((pageNo - 1) * pageSize),
            limit: pageSize,
            include: include,
            where: where,
            order: sortList
        });
    }

    let count = await Job.count({
        distinct: true,
        include: include,
        where: where
    });
    // console.

    jobIdList = [];
    for (let job of jobList) {
        jobIdList.push(job.job_id)

    }

    let fetchedTagDetailDBList = await Job.findAll({
        attributes: ['job_id'],
        order: sortList,
        where: {
            job_id: {
                [Op.in]: jobIdList
            }
        },
        include: [

            {
                model: tag,
                attributes: ['tag_id', 'tag_name'],

                through: {
                    attributes: []
                }

            }
        ]
    });

    return pager.paginate(new JobListView(jobList, fetchedTagDetailDBList), pageNo, pageSize, count, hascreatedDate);

}


module.exports = { listhotJobAll, listJobAll, listjobdetails, listRelatedJobs, getJobList, listjobdetailsWithbullhorn };