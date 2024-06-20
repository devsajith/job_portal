const { body, validationResult } = require('express-validator');
const jobService = require("../service/job-service.js");
const bullhornService = require("../service/bullhorn-service");

const logger  = require('../utils/logger-util');
const { BadRequest } = require('../utils/errors.js');
const  ErrorMessage  = require('../utils/error-code');
const validateMethods = require('../utils/validate-methods');

const listAllHotjob = (req, res, next) => {
    jobService.listhotJobAll()
        .then((response) => {
            res.send(response)
        })
        .catch((error) => {
            next(error)
        })
}
const jobDetails = async (req, res, next) => {
    const jobId = req.params.id;
    
    await jobService.listjobdetails(jobId)
        .then((data) => {
            let categoryIds=[];
            data.jobSubCategory.forEach(element => {
                categoryIds.push(element.dataValues.jobSubCategoryId)
                
            });
            jobService.listRelatedJobs(categoryIds,data.dataValues.JobId).then((response) => {
                const responseData =
                {
                    data,
                    relatedJobs: response
                }
                res.send(responseData)
            })

        })
        .catch((error) => {

            next(error)
        })
}


const getJobList = async(req, res, next ) => {
    logger.info(`Calling Job List API`);

    //Fetching query parameters
    let pageNo = req.query.page;
    let limit = req.query.limit;
    // let maxSalary = req.query.maxSalary;
    let minSalary = req.query.minSalary;
    let area = req.query.area;
    let prefecture = req.query.prefecture;
    let jobCategory = req.query.jobCategory;
    let jobSubCategory = req.query.jobSubCategory;
    let freeText = req.query.freeText;
    let industries = req.query.industry;
    let createdDate = req.query.createdDate;
    let jobId = req.query.jobId;
    let skill = req.query.skill;

    let requestParams = {}

    //validating query parameters
    if( validateMethods.isPositiveInteger( pageNo ) ){
        logger.error(`Invalid page No ${pageNo}`);
        return next(new BadRequest(ErrorMessage.INVALID_PAGE_NO) );
    }
    else
        requestParams.pageNo = parseInt(pageNo);
    
    if( ( validateMethods.isPositiveInteger(limit) )){
        logger.error(`Invalid limit ${limit}`);
        return next( new BadRequest(ErrorMessage.INVALID_PAGE_SIZE) );
    }
    else
        requestParams.limit =  parseInt(limit);

    if( validateMethods.isPositiveInteger( minSalary) ){
        logger.error(`Invalid minSalary ${minSalary}`);
        return next( new BadRequest(ErrorMessage.INVALID_MIN_SALARY) );
    }

    // if( validateMethods.isPositiveInteger( maxSalary) ){
    //     logger.error(`Invalid maxSalary ${maxSalary}`);
    //     return next( new BadRequest(ErrorMessage.INVALID_MAX_SALARY) );
    // }

    // if( validateMethods.isParamString( maxSalary ) && validateMethods.isParamString( minSalary ) && ( Number(maxSalary) <= Number(minSalary)) ){
        
    //     logger.error(`Invalid   minSalary: ${minSalary} & maxSalary: ${maxSalary}`);
    //     return next( new BadRequest(ErrorMessage.INVALID_SALARIES) );
    // }
    else{
        requestParams.minSalary =  parseInt(minSalary);
        // requestParams.maxSalary =  parseInt(maxSalary);
    }

    if(validateMethods.isParamString(prefecture))
        requestParams.prefecture =  prefecture;

    if(validateMethods.isParamString(area))
        requestParams.area =  area;

    if(validateMethods.isParamString(jobCategory))
        requestParams.jobCategory = jobCategory;

    if (validateMethods.isParamString(jobSubCategory))
        requestParams.jobSubCategory = jobSubCategory;
    if (validateMethods.isParamString(skill))
        requestParams.skillList = skill;

    if(validateMethods.isParamString(freeText))
        requestParams.freeText =  freeText;

    if(validateMethods.isParamString(industries)){
        let industryList = industries.split(',');
        if(industryList.length < 1){
            logger.error(`Invalid industry ${industries}`);
            return next( new BadRequest(ErrorMessage.INVALID_INDUSTRY) );
        }
        for(let indusry of industryList)
            if(validateMethods.isPositiveInteger( indusry)){
                logger.error(`Invalid industry ${industries}`);
                return next( new BadRequest(ErrorMessage.INVALID_INDUSTRY) );
            }

        requestParams.industries =  industryList;     
    }

    if(validateMethods.isParamString(createdDate)){
        let crDate ;
        try{
            crDate = new Date(createdDate);
        }
        catch(error ){
            logger.error(`Invalid createdDate ${createdDate}`);
            return next(new BadRequest(ErrorMessage.INVALID_CREATED_DATE) );
        }
        if(!validateMethods.isParamString(jobId)){
            logger.error(`Invalid jobId ${jobId}`);
            return next( new BadRequest(ErrorMessage.INVALID_JOB_ID) );
        }
        if( validateMethods.isPositiveInteger( jobId) ){
            logger.error(`Invalid jobId ${jobId}`);
            return next( new BadRequest(ErrorMessage.INVALID_JOB_ID) );
        }
        requestParams.jobId =  jobId
        requestParams.createdDate =  crDate;
    }
        
        
    
    


    console.log('requestParams: ',requestParams)
    //Fetching job service
    await jobService.getJobList(requestParams ) 
        .then( (response) => {
            res.send(response);
        }
        )
        .catch( (err) => {
            
            next(err);
        })
}



module.exports = { listAllHotjob, jobDetails, getJobList };