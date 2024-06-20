const { Op } = require("sequelize");
const logger = require('../utils/logger-util');
const validateString = require('../validator/string-validator');

const { InternalServerError, NotFound } = require("../utils/errors");
const Company = require("../model/company-model");
const popularCompany = require("../model/popularCompany-model");
const Job = require("../model/jobs-model");
const Industry = require("../model/industry.model");
const Prefecture = require("../model/prefecture-model");
const HighLevelLocation = require('../model/highLevelLocation-model');
const Tag = require('../model/tag-model');
const SalaryRange = require('../model/salary-model')
const CompanyListView = require("../view/company-list.view")
const CompanyDetailView = require("../view/company-detail.view");
/**
 * Method to get companies.
 * @param {*} params 
 * @returns companies
 */
const getCompany = async (params) => {
  let pageSize = 10;
  let pageNo = 0;
  let hasNextPage = false;
  let where = {};
  let freeTextCondition = [];
  freeTextCondition.push({ status: 1 });
  //string validation
  if (validateString(params.name)) {
    freeTextCondition.push({
      [Op.or]: {
          // name: {
          //     [Op.like]: `%${params.name}%`,
          // },
          description: {
              [Op.like]: `%${params.name}%`,
          }
      }
  });
  }
  //check if there is any company with the given industry_id
  if (params.industry_id) {
    const industryIdList = params.industry_id.split(',');
    freeTextCondition.push({ industry_id: { [Op.in]: industryIdList } });
  }
  if (freeTextCondition.length > 0) {
    where[Op.and] = freeTextCondition;
  }
  //pagination implemented
  const companyCount = await Company.count({ where: where });
  logger.info(companyCount, ' companies found');

  if (Number.isInteger(params.size)) {
    pageSize = params.size;
  }
  else {
    pageSize = companyCount;
  }

  if (Number.isInteger(params.pageNo) && params.pageNo > 0) {
    pageNo = (params.pageNo - 1) * pageSize;
  }

  if ((pageNo + pageSize) < companyCount) {
    hasNextPage = true;
  }
  let companyList = [];
  //find all companies with related jobs
  try {
    companyList = await Company.findAll({
      limit: pageSize,
      offset: pageNo,
      where: where,
      include:
        [
          {
            model: Job,
            as: 'jobs',
            include:
              [
                {
                  model: Prefecture,
                  attributes:
                    [
                      ['prefecture_id', 'prefectureId'],
                      ['prefecture_name', 'prefectureName']
                    ],
                  include:
                    [
                      {
                        model: HighLevelLocation,
                        attributes:
                          [
                            ['high_level_location_id', 'highLevelLocationId'],
                            ['high_level_location_name', 'highLevelLocationName']
                          ],
                      }
                    ]
                },
                {
                  model: Tag,
                  attributes:
                    [
                      ['tag_id', 'tagId'],
                      ['tag_name', 'tagName']
                    ],
                  through: {
                    attributes: []
                  }
                },
                {
                  model: SalaryRange,
                  as: "salaryRange",
                  attributes:
                    [
                      ['min_salary', 'minimumSalary'],
                      ['max_salary', 'maximumSalary']
                    ],
                },
              ],
            order: [["created_date", "DESC"]],
          },
          {
            model: Industry,
            as: 'industry',
            attributes:
              [
                ['industry_id', 'industryId'],
                ['name', 'industryName']
              ],
          },
          {
            model: Prefecture,
            as: 'prefectures',
            attributes:
              [
                ['prefecture_id', 'prefectureId'],
                ['prefecture_name', 'prefectureName']
              ]
          }
        ],
      order: [["created_date", "DESC"]],
    });
  }
  catch (error) {
    logger.warn("DB error in company fetch");
    throw new InternalServerError('DB error');
  }
  return new CompanyListView(companyList, companyCount, hasNextPage);
};

/**
 * Method to get popular companies.
 * @returns companies
 */
const getPopularCompany = async () => {
  const companies = await popularCompany.findAll(
    {
      attributes:
        [
          ['popular_company_id', 'popularCompanyId']
        ],
      include:
        [
          {
            model: Company,
            where: { status: 1 },
            attributes:
              [
                ['company_id', 'companyId'],
                ['name', 'companyName'],
                ['company_logo', 'logoUrl']
              ]
          }
        ],
      order: [["created_date", "DESC"]],
    });
  return companies;
};

/**
 * Method to get company details by company_id
 * @param {*} companyId 
 * @returns company
 */
const getCompanyDetailById = async (companyId) => {
  //check if there is any other company with the given name 
  logger.info("fetching company  corresponding to id " + companyId)
  const company = await Company.findOne({
    where: {
      [Op.and]: [{ company_id: companyId }, { status: 1 }]
    },
    // check if job exists in the company
    include:
      [
        {
          model: Job,
          as: 'jobs',
          limit: 500,
          include:
            [
              {
                model: Prefecture,
                attributes:
                  [
                    ['prefecture_id', 'prefectureId'],
                    ['prefecture_name', 'prefectureName']
                  ],
                include:
                  [
                    {
                      model: HighLevelLocation,
                      attributes:
                        [
                          ['high_level_location_id', 'highLevelLocationId'],
                          ['high_level_location_name', 'highLevelLocationName']
                        ],
                    }
                  ]
              },
              {
                model: Tag,
                attributes:
                  [
                    ['tag_id', 'tagId'],
                    ['tag_name', 'tagName']
                  ],
                through: {
                  attributes: []
                }
              },
              {
                model: SalaryRange,
                as: "salaryRange",
                attributes:
                  [
                    ['min_salary', 'minimumSalary'],
                    ['max_salary', 'maximumSalary']
                  ],
              },
            ],
          order: [["created_date", "DESC"]],
        },
        {
          model: Industry,
          as: 'industry',
          attributes:
            [
              ['industry_id', 'industryId'],
              ['name', 'industryName']
            ],
        },
        {
          model: Prefecture,
          as: 'prefectures',
          attributes:
            [
              ['prefecture_id', 'prefectureId'],
              ['prefecture_name', 'prefectureName']
            ]
        }
      ],
  });
  if (company) {
    return new CompanyDetailView(company);
  } else throw new NotFound(25201, "Company Not found");
};

module.exports = {
  getPopularCompany,
  getCompany,
  getCompanyDetailById
};
