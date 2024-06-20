const { validationResult } = require('express-validator');
const inquiryService = require('./../service/inquiry.service');
const logger = require('../utils/logger-util');
const { BadRequest} = require('../utils/errors');

/**
 * Method to create inquiry
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const createInquiry = async (req, res, next) => {
    const inquiryForm = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequest(errors.errors[0].msg));
    }
    inquiryService.createInquiry(inquiryForm)
        .then((response) => {
            logger.info(`Inquiry creation api called`);
            res.sendStatus(200);
        })
        .catch((error) => {
            next(error);
        });
}

module.exports = { createInquiry };
