const logger = require('../utils/logger-util');
const companyService = require("../service/company-service");
const { validationResult } = require('express-validator');
const { BadRequest} = require('../utils/errors');

/**
 * Method to get company list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequest(errors.errors[0].msg));
    }
    let params = {};
    params.name = req.query.name;
    params.pageNo = parseInt(req.query.pageNo);
    params.size = parseInt(req.query.size);
    params.industry_id = req.query.industry_id;
    logger.info("Company list api called");
    companyService.getCompany(params)
        .then((response) => {
            res.send(response)
        })
        .catch((error) => {
            console.log(error);
            next(error);
        })
}

/**
 * Method to list  popular company.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getPopularCompany = async (req, res, next) => {
    logger.info("Popular company list api called");
    companyService.getPopularCompany()
        .then((response) => {
            res.send(response)
        })
        .catch((error) => {
            console.log(error);
            next(error);
        })
}

/**
 * Method to get company details by company_id
 * @param {*} req 
 * @param {*} next 
 */
const getCompanyDetailById = async (req, res, next) => {
    const company_id = req.params.id;
    logger.info("Company details api called ");
    companyService.getCompanyDetailById(company_id)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            console.log(error);
            next(error);
        })
}

module.exports = {
    getCompany,
    getPopularCompany,
    getCompanyDetailById
};
