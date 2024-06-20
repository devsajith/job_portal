const JobApplication = require("../model/job-application.model");
const User = require("../model/user-model");
const EmailTemplate = require('../model/emailTemplate.model');
const emailType=require('../types/emailTemplate-type');
const jobService = require('./../service/job-service')
const bullhornService = require('./../service/bullhorn-service');
const logger = require('../utils/logger-util');
const emailService = require('../config/aws-config');
const { NotFound, BadRequest } = require('../utils/errors');
const ErrorMessage = require('../utils/error-code');

/**
 * Method to create a new job application
 * @param {*} jobId 
 * @param {*} userId 
 * @returns 
 */
const updatebullhornId = async (createdJob,bullhornId) => {

    const job_application=await JobApplication.findByPk(createdJob.job_application_id)
    job_application.bullhorn_id=bullhornId

    job_application.bullhorn_updated_date=new Date();
    await job_application.save()
}

const createJobApplication = async (jobApplicationObj) => {
    const userId = jobApplicationObj.userId;

    logger.info(`Checking whether user ${userId}  has already  applied for any job`);
    const jobApplicationExistObj = await JobApplication.findOne({
        where: {
            user_id: userId

        }
    });
    console.log( 'jobApplicationExistObj:      ',typeof(jobApplicationExistObj))
    if (jobApplicationExistObj) {
        logger.error(`user ${userId}  has already  applied for  job ${jobApplicationExistObj.job_id}`);
        throw new BadRequest(ErrorMessage.USER_JOB_APPLIED);
    }

    const email = jobApplicationObj.email;
    const jobId = jobApplicationObj.jobId;
    logger.info("checking for job in DB");
    const job = await jobService.listjobdetailsWithbullhorn(jobId)
    logger.info("fetching user details from user table in DB");
    const user = await User.findOne({
        where: {
            user_id: userId
        }
    });
    if (job.dataValues.status == 1) {
       

        
        let jobApplication = {
            job_id: jobId,
            user_id: userId,
            status: 1,
            user_name: user.last_name
        }
        const createJobApplicationObj = await JobApplication.create(jobApplication)
        try {
            let userTemplate = await EmailTemplate.findByPk(emailType.JOB_APPLY);
            //sending verification  mail
            logger.info('send job applied email to user');
            emailService.sendEmail(email, userTemplate.header, jobApplication.user_name+' '+userTemplate.body);
        }
        catch (error) {
            logger.error(`sending email for job application  ${jobApplicationObj.email} failed`);
        }
        return createJobApplicationObj;
    }
    else {
        throw new NotFound(26201, 'Job Not found');
    }

};

module.exports = { createJobApplication,updatebullhornId };
