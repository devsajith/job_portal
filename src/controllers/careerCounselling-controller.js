const { body, validationResult } = require('express-validator');
const { BadRequest} = require('../utils/errors');
const logger  = require('../utils/logger-util');
const careerCounsellingService = require("../service/career-couselling-service");
const UserModel = require("../model/user-model");
const userType   = require('../types/user-type');
const bullhornService = require("../service/bullhorn-service");
const  ErrorMessage  = require('../utils/error-code');



const applyCareerCounselling = async (req, res, next) => {
    
    logger.info( `Apply career couseling for ${req.user.user_id}`);
     let careerCounsellingApplication = await careerCounsellingService.applyCareerCounselling(req.user.user_id)
    .then( (resp) => {
        res.send(resp)
        return resp;
        
    } )
    .catch( (err) => {
        console.log(err)
        logger.error( `Error occurred while applying career couseling for ${req.user.user_id}`);
        next(err)
    })
    console.log("returned applied", careerCounsellingApplication);
    if(careerCounsellingApplication != null){
        
     await bullhornService.applyCareerCounselling(careerCounsellingApplication);
    }

}

const applyCareerCounsellingWithoutAuth = async (req, res, next) => {
    
    
    logger.info( `Apply career couseling for ${req.body.userId}`);
    const userDbObj =  await UserModel.findByPk(req.body.userId);
    if(!userDbObj || userDbObj.status != userType.Created){
       return next( new BadRequest(ErrorMessage.USER_NOT_FOUND));

    }
     let careerCounsellingApplication = await careerCounsellingService.applyCareerCounselling(userDbObj.user_id)
    .then( (resp) => {
        res.send(resp)
        return resp;
        
    } )
    .catch( (err) => {
        console.log(err)
        logger.error( `Error occurred while applying career couseling for ${userDbObj.user_id}`);
        next(err)
    })
    console.log("returned applied", careerCounsellingApplication);
    if(careerCounsellingApplication != null){
        
     await bullhornService.applyCareerCounselling(careerCounsellingApplication);
    }

}

module.exports = { applyCareerCounselling, applyCareerCounsellingWithoutAuth };