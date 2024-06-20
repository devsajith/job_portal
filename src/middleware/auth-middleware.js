const jwt = require('jsonwebtoken');

const { BadRequest} = require('../utils/errors');
const User = require('../model/user-model');
const userType = require('../types/user-type');
const errorMessage =require('../utils/error-code');
const LOGGER = require('../utils/logger-util')

const tokenReader  =  async(req,res, next) => {

    //fetching auth header
    const accessToken =  req.header('Authorization');   
    if(!accessToken) {
        return next(new BadRequest(errorMessage.AUTHENTICATION_REQUIRED));
    }
    if((! accessToken.split(" ")[0].localeCompare(process.env.BEARER) == 0)) {
        return next(new BadRequest(errorMessage.AUTHENTICATION_REQUIRED));
    }

    //verifying token
    let authUserDetails ;
    try{
     authUserDetails = jwt.verify(accessToken.split(" ")[1], process.env.ACCESS_TOKEN_SECRET);
    }
    catch (error) {
        LOGGER.error(`error: ${error}`);
        if (error instanceof jwt.TokenExpiredError) {

            return next(new BadRequest(errorMessage.TOKEN_EXPIRED));
        }
        
        return next(new BadRequest(errorMessage.TOKEN_INVALID));
    }

    
    const userObj = await User.findOne(
        {
            where: {
                email: authUserDetails.email
            }, 
            attributes: ['user_id', 'status', 'email', 'password', 'password_change_date'],
        });
    if(userObj){
        if(userObj.status == userType.Deleted){
            LOGGER.warn('User is deleted');
            return next( new BadRequest(errorMessage.USER_DELETED) );
        }
        if(userObj.status == userType.Suspended){
            LOGGER.warn('User is Suspended');
            return next( new BadRequest(errorMessage.USER_UNPUBLISHED) );
        }
        if(userObj.status == userType.Created){
            LOGGER.warn('User mail not verified');
            return next( new BadRequest(errorMessage.EMAIL_NOT_VERIFIED) );
        }
  
    } 
    if(userObj == null){
        LOGGER.warn('User not found');
        return next(new BadRequest(errorMessage.AUTHENTICATION_REQUIRED));
    }
    if( (new Date(authUserDetails.passwordChangeDate)).getTime() != (userObj.password_change_date).getTime() ){
        LOGGER.warn('password already changed');
        return next( new BadRequest(errorMessage.PASSWORD_ALREADY_CHANGED) );
    }
  

    //adding user details to request
    req.user = authUserDetails;

    return next();
}


module.exports = tokenReader;