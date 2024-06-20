const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const CryptoJS = require('crypto-js');
const secretKey = 'XkhZG4fW2t2W';

const { NotFound, BadRequest } = require('../utils/errors');
const User = require('../model/user-model');
const EmailTemplateModel = require('../model/emailTemplate.model');
const userType = require('../types/user-type');
const EmailTemplateType = require('../types/emailTemplate-type');
const logger = require('../utils/logger-util');
const emailService = require('../config/aws-config');
const errorMessage = require('../utils/error-code');
const UserDetailView = require('../view/user-detail.view');


const createUser = async (userForm, registrationSourceType) => {
  logger.info('Checking for user in DB')
  //checking for user in DB
  const userObj = await User.findOne({ where: { email: userForm.email }, attributes: ['user_id', 'status'], },
  );
  if (userObj) {
    if (userObj.status == userType.Deleted) {
      logger.warn('User is deleted');
      throw new BadRequest(errorMessage.USER_DELETED);
    }
    if (userObj.status == userType.Suspended) {
      logger.warn('User is Suspended');
      throw new BadRequest(errorMessage.USER_UNPUBLISHED);
    }

    if (userObj.status == userType.Created) {
      logger.warn('User is Suspended');
      throw new BadRequest(errorMessage.EMAIL_NOT_VERIFIED);
    }
    logger.warn('user already exists');
    throw new BadRequest('21111-user already exists');
  }

  //generating hash
  const salt = await bcrypt.genSalt(10);
  // Decrypt
  const decryptedText = CryptoJS.AES.decrypt(userForm.password, secretKey).toString(CryptoJS.enc.Utf8);
  console.log('Decrypted Text createUser password:', decryptedText);

  const password = await bcrypt.hashSync(decryptedText, salt);

  //creating email verificartion token
  const emailVerificartionToken = jwt.sign(
    {
      userId: userForm.fullName,
      email: userForm.email
    },
    process.env.EMAIL_TOKEN_SECRET,
    {
      expiresIn: process.env.EMAIL_TOKEN_VALIDITY,
    }
  );
  if (userForm.resume)
  // resume upload to s3
  {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
    const OLD_KEY = 'temporary/' + userForm.resume
    const NEW_KEY = 'resume/' + userForm.resume
    let s3 = new AWS.S3();
    //copy object from temporary folder to resume folder
    const params = {
      Bucket: process.env.BUCKET,
      CopySource: `${process.env.BUCKET}/${OLD_KEY}`,
      Key: NEW_KEY,
      ACL: 'public-read'
    };
    await s3.copyObject(params, function (err, data) {
      if (err)
        throw new BadRequest("Resume not uploaded"); // an error occurred
    });
  }
  logger.info("creating user")
  let createdUser;
  try {
    // saving user to DB
    createdUser = await User.create({
      first_name: userForm.fullName,
      middle_name: userForm.middleName,
      last_name: userForm.lastName,
      email: userForm.email,
      prefecture: userForm.prefecture,
      city: userForm.city,
      apartment_name: userForm.apartmentName,
      date_of_birth: null,
      status: userType.Created,
      password: password,
      source_type: registrationSourceType,
      tel_number: userForm.telNumber,
      desired_occupation: userForm.desiredOccupation,
      resume: userForm.resume
    });
    logger.info('user created');
  } catch (error) {
    console.log(error)
    logger.error('error: ', error);
    throw error;
  }
  await creatingVeriyUserMailContent(userForm.lastName, userForm.email, emailVerificartionToken)
  return createdUser;
}

const listUserDetailsWithbullhorn = async (userId) => {
  logger.info("fetching job  with bullhorn id corresponding to id" + userId)
  let data = await User.findByPk(userId, {
    attributes: ['user_id', 'status', 'email', 'password', 'bullhorn_id'],
  })
  return data

}

const verifyEmail = async (token) => {
  logger.info(`Verifying token `);
  //verifying token``
  let authUserDetails;
  try {
    authUserDetails = await jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
  }
  catch (error) {

    if (error.name === 'TokenExpiredError') {

      logger.info(`Resending verifying email for user `);
      const payload = await jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, { ignoreExpiration: true });

      const userObj = await User.findOne({ where: { email: payload.email, status: userType.Created } })
      if (userObj && userObj.first_name) {

        //creating email verificartion token
        const emailVerificartionToken = jwt.sign(
          {
            userId: userObj.first_name,
            email: userObj.email
          },
          process.env.EMAIL_TOKEN_SECRET,
          {
            expiresIn: process.env.EMAIL_TOKEN_VALIDITY,
          }
        );
        await creatingVeriyUserMailContent(userObj.last_name, userObj.email, emailVerificartionToken)
        throw new BadRequest(errorMessage.TOKEN_EXPIRED_RESEND);
      }
      else {
        logger.error(`invalid user`);
        throw new BadRequest(errorMessage.TOKEN_INVALID);
      }
    }
    else {
      logger.error(`Invalid email verify token`);
      throw new BadRequest(errorMessage.TOKEN_INVALID);
    }
  }
  //Fetching user details
  let userObj = {};
  try {
    userObj = await User.findOne({ where: { email: authUserDetails.email }, attributes: ['user_id', 'status'], });
  }
  catch (error) {
    logger.error(`Email verify internal server error`);
    throw new InternalServerError('DB error');
  }
  if (!userObj) {
    throw new BadRequest(errorMessage.USER_NOT_FOUND);
  }
  logger.info(`verifying email for user ${userObj.email}`);
  if (userObj.status == userType.Deleted) {
    logger.error(`Email verify  user deleted`);
    throw new BadRequest(errorMessage.USER_DELETED);
  }
  if (userObj.status == userType.Active) {
    logger.error(`Email verify  user active`);
    throw new BadRequest(errorMessage.USER_IS_ALREADY_ACTIVE);
  }
  if (userObj.status == userType.Suspended) {
    logger.error(`Email verify  user unpublised`);
    throw new BadRequest(errorMessage.USER_UNPUBLISHED);
  }
  //updating user in DB
  userObj.status = userType.Active;
  await userObj.save();
  return userObj.user_id
}


const changePassword = async (changePasswordForm, email) => {
  const userObj = await User.findOne({ where: { email: email } });
  if (userObj) {
    if (userObj.status == userType.Deleted) {
      logger.warn('User is deleted');
      throw new BadRequest(errorMessage.USER_DELETED);
    }
    if (userObj.status == userType.Suspended) {
      logger.warn('User is Suspended');
      throw new BadRequest(errorMessage.USER_UNPUBLISHED);
    }

    if (userObj.status == userType.Created) {
      logger.warn('User is created');
      throw new BadRequest(errorMessage.EMAIL_NOT_VERIFIED);
    }
  }
  else {
    throw new BadRequest(errorMessage.EMAIL_NOT_VERIFIED);
  }

  const match = await bcrypt.compare(changePasswordForm.oldPassword, userObj.password);
  if (!match) {
    throw new NotFound('Incorrect OLD Password');
  }
  logger.info(`changing password for ${userObj.email}`);
  //generating hash
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hashSync(changePasswordForm.newPassword, salt);

  userObj.password = password;
  userObj.password_change_date = new Date();
  userObj.save();
  return "changePassword";
}



const resendVerifyEmail = async (email) => {
  const userObj = await User.findOne({ where: { email: email } });
  if (!userObj) {
    throw new BadRequest(errorMessage.FORGOT_PASSWORD_EMAIL_NOT_FOUND);
  }
  if (userObj.status == userType.Deleted) {
    throw new BadRequest(errorMessage.USER_DELETED);
  }
  if (userObj.status == userType.Active) {
    throw new BadRequest(errorMessage.USER_IS_ALREADY_ACTIVE);
  }
  if (userObj.status == userType.Suspended) {
    throw new BadRequest(errorMessage.USER_UNPUBLISHED);
  }



  //creating email verificartion token
  const emailVerificartionToken = jwt.sign(
    {
      userId: userObj.first_name,
      email: userObj.email
    },
    process.env.EMAIL_TOKEN_SECRET,
    {
      expiresIn: process.env.EMAIL_TOKEN_VALIDITY,
    }
  );


  await creatingVeriyUserMailContent(userObj.last_name, userObj.email, emailVerificartionToken)
}

const creatingVeriyUserMailContent = async (firstName, email, emailVerificartionToken) => {
  logger.info(`Creating veriy user mail content`);
  let verifyEmailTemplate = await EmailTemplateModel.findOne({
    where: {
      email_template_type: EmailTemplateType.VERIFY_EMAIL
    }
  });

  const verifyUserURl = process.env.CLIENT_BASE_URL + "/login/" + emailVerificartionToken;
  const verifyUserURlName = process.env.CLIENT_BASE_URL + "/login/";
  let verifyUserEmailBody = verifyEmailTemplate.body;
  verifyUserEmailBody = verifyUserEmailBody.replace(/userName/g, firstName);
  verifyUserEmailBody = verifyUserEmailBody.replace(/verifyUserLink/g, verifyUserURl);
  verifyUserEmailBody = verifyUserEmailBody.replace(/verifyUserNameLink/g, verifyUserURlName);

  try {

    await emailService.sendEmail(email, verifyEmailTemplate.header, verifyUserEmailBody)
  }
  catch (error) {
    logger.error(`Sending email to user  ${userForm.email} failed`, error);
    throw new BadRequest(errorMessage.EMAIL_FAILED);
  }


}

const getUserDetails = async (userId) => {
  let userDbObj = await User.findOne({
    where: {
      user_id: userId,
      status: userType.Active
    }
  });
  if (!userDbObj) {
    throw new BadRequest(errorMessage.USER_NOT_FOUND)
  }
  return new UserDetailView(userDbObj);
}
module.exports = {
  createUser,
  verifyEmail,
  changePassword,
  listUserDetailsWithbullhorn,
  resendVerifyEmail,
  getUserDetails
};