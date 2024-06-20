const { BadRequest } = require('../utils/errors');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger-util');

const userService = require('../service/user-service');
const bullhornService = require('../service/bullhorn-service');

const create = async (req, res, next) => {
    logger.info("Inside create user");
    const userForm = req.body;
    const registrationSourceType = req.query.source;// [0-login_button,1-career_counselling,2-job_apply]
    //validating request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Validation error occurred ${errors.errors[0].msg}`);
        return next(new BadRequest(errors.errors[0].msg));
    }
    let user = await userService.createUser(userForm, registrationSourceType)
        .then((userResponse) => {
            logger.info("Called createUser method");
            res.send(userResponse);
            return userResponse;
        })
        .catch((error) => {
            logger.info("Error occurred in calling createUser", error);
            next(error);
        })
    if (user && user.user_id) {
        await bullhornService.createCandidate(user.user_id);
    }
}

const verifyEmail = async (req, res, callback) => {
    logger.info("Inside verifyEmail");
    //validating request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Validation error occurred ${errors.errors[0].msg}`);
        callback( new BadRequest(errors.errors[0].msg));
    }
    await userService.verifyEmail(req.body.token)
        .then((userResponse) => {
            logger.info("Called verifyEmail method");
            res.sendStatus(200);
            return userResponse;
        })
        .catch(err => {
            logger.info("Error occurred in calling verifyEmail", err);
            callback(err);
        })
}

const resendVerifyEmail = (req, res, next) => {
    logger.info(`Inside resend verification mail`);
    //validating request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Validation error occurred ${errors.errors[0].msg}`);
        return next(new BadRequest(errors.errors[0].msg));
    }
    userService.resendVerifyEmail(req.body.email)
        .then((resp) => {
            logger.info("Called resendVerifyEmail");
            return res.sendStatus(200);
        })
        .catch(err => {
            logger.info("Error occurred in calling resendVerifyEmail", err);
            return next(err);
        });
}

const changePassword = async (req, res, next) => {
    logger.info(`Inside changePassword method`);
    //validating request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(`Validation error occurred ${errors.errors[0].msg}`);
        return next(new BadRequest(errors.errors[0].msg));
    }
    userService.changePassword(req.body, req.user.email)
        .then((userResponse) => {
            logger.info("Called changePassword");
            res.status(200)
            return res.send({ message: "success" });
        })
        .catch(err => {
            logger.error("Error occurred in calling changePassword", err)
            return next(err);
        })
}

const getUserDetails = (req, res, next) => {
    logger.info(`User details api called`);
    userService.getUserDetails(req.user.user_id)
        .then((resp) => {
            logger.info("Called getUserDetails");
            return res.send(resp);
        })
        .catch((err) => {
            logger.error("Error occurred in calling getUserDetails", err)
            return next(err);
        })
}

module.exports = {
    create,
    verifyEmail,
    changePassword,
    resendVerifyEmail,
    getUserDetails
};