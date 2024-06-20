const CareerCounselling = require('../model/careerCounselling-model');
const CareerCounsellingApplication = require('../model/careerCounsellingApplication-model');
const LOGGER  = require('../utils/logger-util');

const UserModel = require("../model/user-model");
const emailType=require('../types/emailTemplate-type');
const EmailTemplate= require('../model/emailTemplate.model');
const { NotFound, InternalServerError, BadRequest } = require('../utils/errors');
const ErrorMessage = require('../utils/error-code');


const applyCareerCounselling = async( userId ) => {
    const userObj = await UserModel.findByPk(userId);

    let careerCounsellingApplicationDbCheckObj = null;
    careerCounsellingApplicationDbCheckObj = await CareerCounsellingApplication.findOne({
        where: {
            user_id: userId
        }
    });
    LOGGER.info(`Checking career  counselling application for user ${userId}`);
    if(careerCounsellingApplicationDbCheckObj != null){
        LOGGER.error(`Career  counselling application found for user ${userId}`);
        throw new BadRequest(ErrorMessage.CAREER_COUNSELING_USER_APPLIED);

    }

    LOGGER.info(`Fetching career counsell job from DB for ${userId}`);
    let     careerCounselling = null;
    careerCounselling = await CareerCounselling.findOne( {
        where: {
            type : 1
        }
    });
    if(careerCounselling ==null){
        LOGGER.error(`CareerCounselling not found in error`);
        throw new BadRequest(' CareerCounselling not found');

    }
    let careerCounsellingApplication = null;
    careerCounsellingApplication = await CareerCounsellingApplication.create({
        career_counselling_id: careerCounselling.career_counselling_id,
        user_id: userId

    });
    await sendCareerCounsilMail(userObj) ;
    LOGGER.info(`Application created in  DB`);
    return careerCounsellingApplication;
}


const sendCareerCounsilMail = async ( userObj ) => {
    const emailService = require('../config/aws-config');
    
    
        try {

            let userTemplate = await EmailTemplate.findByPk(emailType.CAREER_COUNSELLING_USER);
            
            const userTemplateBody = createEmailbody(userTemplate.body, userObj);
            if (process.env.JOB_SITE_SENDER_MAIL)
                try {
                    
                    if (userObj.email) {
                        LOGGER.info(`Sending  career counselling email to user`);
                        console.log('userTemplateBody: ',userTemplateBody);
                        await emailService.sendEmail(userObj.email, userTemplate.header, userTemplateBody)
                    }
                }
                catch (error) {
                    console.log(error)
                    LOGGER.error(`Mail sending to  failed`);
                    LOGGER.error(error)
                }
        }
        catch (error) {
            LOGGER.error(`Fetching career counselling user mail template causes error`)
            LOGGER.error(error)
        }

    

}

const createEmailbody = (body, userObj) => {
    body = body.replace(/careerCounsilLastName/g, userObj.last_name);
    console.log(' body', body);
    return body
}

module.exports = { applyCareerCounselling }