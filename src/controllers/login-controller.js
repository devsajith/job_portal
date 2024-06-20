const { body, validationResult } = require('express-validator');
const { response } = require('express');

const { BadRequest} = require('../utils/errors');
const loginService = require('../service/login-service');
const logger  = require('../utils/logger-util');


const login = async(req, res, next) => {
    logger.info(`login api called`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
       return next( new BadRequest(errors.errors[0].msg) );
    }
    
    const loginForm = req.body;
    loginService.login(loginForm)
    .then(response =>{
        return res.send(response)
    })
    .catch(err => {
        logger.error(err)
        return next(err);
    })
};

const forgotPassword = async( req, res, next) => {
    logger.info(`forgotPassword api called`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
        return next( new BadRequest(errors.errors[0].msg));
    }

    loginService.forgotPassword(req.body)
    .then(response =>{
        return res.sendStatus(200);
    })
    .catch(err => {
        logger.error(err)
        return next(err);
    })

}

const validateForgotPassword = async( req, res, next) => {
    logger.info(`validateForgotPassword api called`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
        return next( new BadRequest(errors.errors[0].msg));
    }   
    loginService.validateForgotPassword(req.body)
    .then( response => {
        return res.send({ 'message' : "success"});
    })
    .catch( err => {
        logger.error(err)
        return next(err);
    })

}


const refreshToken = async( req, res, next ) => {
    logger.info(`refreshToken api called`);
    //validating request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.errors[0].msg)
        return next( new BadRequest(errors.errors[0].msg));
    } 
    
    loginService.refreshToken(req.body)
    .then( response => {
        return res.send(response);
    })
    .catch( err => {
        
        logger.error(err)
        return next(err);
    })
}


module.exports= { login, forgotPassword, validateForgotPassword, refreshToken }