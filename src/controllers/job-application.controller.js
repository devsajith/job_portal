const { validationResult } = require('express-validator');
const { BadRequest } = require('../utils/errors');
const jobApplicationService = require('./../service/job-application.service');

const bullhornService = require('./../service/bullhorn-service');
const logger = require('../utils/logger-util');
const UserModel = require("../model/user-model");
const userType = require('../types/user-type');
const errorMessage = require('../utils/error-code');

/**
 * Method to create job application
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const createJobApplication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
        return next(new BadRequest(errors.errors[0].msg));
    };

    let jobApplicationObj = {
        userId: req.user.user_id,
        jobId: req.body.jobId,
        email: req.user.email
    };

   let createdJob=await jobApplicationService.createJobApplication(jobApplicationObj).then((response) => {
    res.sendStatus(200);
    return response
         
    }).catch(error => {
        logger.error(error);
        return next(error);
    })
    if(createdJob)
    {
        const bullhornId=await bullhornService.applyJob(req.user.user_id,req.body.jobId)
        if(bullhornId)
        {
            await jobApplicationService.updatebullhornId(createdJob,bullhornId)
        }
      
    }

}

const createJobApplicationWithoutAuth = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
        return next(new BadRequest(errors.errors[0].msg));
    };
    const userId = req.params.userId;

    logger.info(`Applying job for user ${userId}`)
    const userObj = await UserModel.findOne({
        where:{
            user_id: userId
        }
    });

    if (!userObj) {
        return next( new BadRequest(errorMessage.USER_NOT_FOUND) );
      }
    if (userObj.status == userType.Deleted) {
        logger.warn('User is deleted');
        return next( new BadRequest(errorMessage.USER_DELETED) );
      }
      if (userObj.status == userType.Suspended) {
        logger.warn('User is Suspended');
        return next( new BadRequest(errorMessage.USER_UNPUBLISHED) );
      }
  
      if (userObj.status == userType.Active) {
        logger.warn('User is already activated');
        return next( new BadRequest(errorMessage.EMAIL_ALREADY_EXIST) );
      }
    let jobApplicationObj = {
        userId: userObj.user_id,
        jobId: req.body.jobId,
        email: userObj.email
    };

   let createdJob=await jobApplicationService.createJobApplication(jobApplicationObj).then((response) => {
    res.sendStatus(200);
    return response
         
    }).catch(error => {
        logger.error(error);
        return next(error);
    })
    setTimeout(async() => {
       
        if(createdJob && userObj )
        {   
            
            const bullhornId=await bullhornService.applyJob(userObj.user_id,req.body.jobId)
            if(bullhornId)
            {
                await jobApplicationService.updatebullhornId(createdJob,bullhornId)
            }
        }
      }, "3000")
   

}

module.exports = { createJobApplication, createJobApplicationWithoutAuth };
