const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');
const secretKey = 'XkhZG4fW2t2W';

const userType = require('../types/user-type');
const EmailTemplateType = require('../types/emailTemplate-type');
const loginView = require('../view/loginView');
const User = require('../model/user-model');
const EmailTemplateModel = require('../model/emailTemplate.model');
const { NotFound, BadRequest, InternalServerError } = require('../utils/errors');
const emailService = require('../config/aws-config');
const logger  = require('../utils/logger-util');
const  errorMessage  = require('../utils/error-code');

const login = async(loginForm) => {

    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET  } = process.env;

    //checking dor user in DB
    const userObj = await User.findOne({ where: { email: loginForm.email},attributes:['user_id','status','first_name','email','password','password_change_date'], });

    if( userObj === null){
        throw new NotFound(errorMessage.USERNAME_AND_PASSWORD_MISMATCH);
    };
    if(userObj){
      if(userObj.status == userType.Deleted){
          logger.warn('User is deleted');
          throw new BadRequest(errorMessage.USER_DELETED);
      }
      if(userObj.status == userType.Suspended){
          logger.warn('User is Suspended');
          throw new BadRequest(errorMessage.USER_UNPUBLISHED);
      }
      if(userObj.status == userType.Created){
        throw new BadRequest(errorMessage.EMAIL_NOT_VERIFIED);
      }

  }    
    // Decrypt
    const decryptedPassword = CryptoJS.AES.decrypt(loginForm.password, secretKey).toString(CryptoJS.enc.Utf8);

    const match = await bcrypt.compare(decryptedPassword, userObj.password);
    if(!match){
        throw new NotFound(errorMessage.USERNAME_AND_PASSWORD_MISMATCH);
    }
    const accessToken = jwt.sign(
        { user_id: userObj.user_id, email: userObj.email, passwordChangeDate: userObj.password_change_date },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_VALIDITY,
        }
      );

      const refreshToken = jwt.sign(
        { user_id: userObj.user_id, email: userObj.email,  passwordChangeDate: userObj.password_change_date  },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_VALIDITY,
        }
      );


      
    return {
         applicantId :userObj.user_id,
         fullName :userObj.first_name,
         email :userObj.email,
         accessToken :accessToken,
         refreshToken : refreshToken
      };
};


const forgotPassword = async(forgotPasswordForm) => {

      //checking for user in DB
      const userObj = await User.findOne({ where: { email: forgotPasswordForm.email} });
      if(!userObj){
          throw new BadRequest(errorMessage.FORGOT_PASSWORD_EMAIL_NOT_FOUND);
      }
      if(userObj.status == userType.Deleted){
        throw new BadRequest(errorMessage.USER_DELETED);
      }
      if(userObj.status == userType.Suspended){
        throw new BadRequest(errorMessage.USER_UNPUBLISHED);
      }
      if(userObj.status == userType.Created){
        throw new BadRequest(errorMessage.EMAIL_NOT_VERIFIED);
      }
      

      logger.error(`Creating forgot password token with validity ${ process.env.FORGOT_PASSWORD_EMAIL_TOKEN_VALIDITY}`)
      
      //creating email token
      const emailToken = jwt.sign(
        { userId: userObj.user_id,
          email: userObj.email, 
          passwordChangeDate: userObj.password_change_date 
        },
        process.env.EMAIL_TOKEN_SECRET,
        {
          expiresIn: process.env.FORGOT_PASSWORD_EMAIL_TOKEN_VALIDITY,
        }
  );
  logger.info(`Fetcing forgot password email template from DB`);
  let forgotPassword1EmailTemplate = await EmailTemplateModel.findOne({
    where: {
      email_template_type: EmailTemplateType.FORGOT_PASSWORD
    }
  });
  //creating forgot passwod url
  const resetUrl = process.env.CLIENT_BASE_URL + "/reset-password/" + emailToken;
  const resetUrlLinkName = process.env.CLIENT_BASE_URL + "/reset-password/";
  let forgotPasswordEmailBody = forgotPassword1EmailTemplate.body;
  forgotPasswordEmailBody = forgotPasswordEmailBody.replace(/userName/g, userObj.last_name);
  forgotPasswordEmailBody = forgotPasswordEmailBody.replace(/forotPasswodLink/g, resetUrl);
  forgotPasswordEmailBody = forgotPasswordEmailBody.replace(/forotPasswodNameLink/g, resetUrlLinkName);

  //Add code to send mail here
  //sending verification  mail
  try {

    await emailService.sendEmail(forgotPasswordForm.email, forgotPassword1EmailTemplate.header, forgotPasswordEmailBody)
  }
  catch (error) {
    logger.warn("Mail sending failed");
    throw new InternalServerError(`Mail sending failed ${forgotPasswordForm.email}`)
  }
      // returning reset url will be removed in future
      return {resetUrl: resetUrl};
  
}

const validateForgotPassword = async (forgotPasswordForm) => {
  //verifying token
  let authUserDetails;
  try {
    authUserDetails = jwt.verify(forgotPasswordForm.token, process.env.EMAIL_TOKEN_SECRET);
  }
  catch (error) {
    console.log(error)
    throw new BadRequest(errorMessage.TOKEN_INVALID);
  }
  //Fetching user details
  let userObj = {};
  try {
    userObj = await User.findOne({ where: { email: authUserDetails.email } });
  }
  catch (error) {
    throw new InternalServerError('DB error');
  }
  if (!userObj) {
    throw new BadRequest(errorMessage.USER_NOT_FOUND);
  }
  if (userObj.status == userType.Deleted) {
    throw new BadRequest(errorMessage.USER_DELETED);
  }
  if (userObj.status == userType.Suspended) {
    throw new BadRequest(errorMessage.USER_UNPUBLISHED);
  }
  if ((new Date(authUserDetails.passwordChangeDate)).getTime() != (userObj.password_change_date).getTime()) {
    throw new BadRequest(errorMessage.PASSWORD_ALREADY_CHANGED);
  }

  //generating hash
  const salt = await bcrypt.genSalt(10);

  const decryptedPassword = CryptoJS.AES.decrypt(forgotPasswordForm.password, secretKey).toString(CryptoJS.enc.Utf8);

  const password = await bcrypt.hashSync(decryptedPassword, salt);

  //updating user password
  userObj.password = password;
  userObj.password_change_date = new Date();

  await userObj.save();

} 

const refreshToken = async( refreshTokenForm ) => {

  //verifying token
  let userDetails;
  try {
    userDetails = jwt.verify(refreshTokenForm.token, process.env.REFRESH_TOKEN_SECRET);
  }
  catch (error) {
    logger.error(`error: ${error}`);
    if (error instanceof jwt.TokenExpiredError) {

        throw new BadRequest(errorMessage.TOKEN_EXPIRED);
    }
    throw new BadRequest(errorMessage.TOKEN_INVALID);
  }
  let userObj = {};
  try {
    userObj = await User.findOne({ where: { email: userDetails.email } });
  }
  catch (error) {
    throw new InternalServerError('DB error');
  }
  if (!userObj) {
    throw new  BadRequest(errorMessage.USER_NOT_FOUND);
  }
  if (userObj.status == userType.Deleted) {
    throw new BadRequest(errorMessage.USER_DELETED);
  }
  if (userObj.status == userType.Suspended) {
    throw new BadRequest(errorMessage.USER_UNPUBLISHED);
  }
  if ((new Date(userDetails.passwordChangeDate)).getTime() != (userObj.password_change_date).getTime()) {
    throw new BadRequest(errorMessage.PASSWORD_ALREADY_CHANGED);
  }


  //creating new access token
  const accessToken = jwt.sign(
    { user_id: userObj.user_id, email: userObj.email, passwordChangeDate: userObj.password_change_date },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_VALIDITY,
    }
  );

  //creating refresh token
  const refreshToken = jwt.sign(
    { user_id: userObj.user_id, email: userObj.email, passwordChangeDate: userObj.password_change_date  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_VALIDITY,
    }
  );
  
  logger.info(`New access token created for user ${ userObj.user_id}`);

  return { 
            accessToken: accessToken,
            refreshToken: refreshToken
         }
}

module.exports= {login, forgotPassword, validateForgotPassword, refreshToken }