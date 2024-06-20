const logger  = require('../utils/logger-util');
const industryService = require('../service/industry-service');
const { BadRequest} = require('../utils/errors');


//List all industries
const listIndustry = (req, res, next) => {
    logger.info('Fetching Industry List');  
    industryService.listAllIndustry()
    .then( (resp) => {
        logger.info('rendering  Industry List');
        return res.send(resp);

    })
    .catch( (err) => {
        logger.warn("An error occurred while fetching industry List")
        return next(new BadRequest(err.message));
    })
};

module.exports = { listIndustry }