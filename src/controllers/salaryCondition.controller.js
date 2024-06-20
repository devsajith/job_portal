const logger  = require('../utils/logger-util');
const salaryConditionService = require('../service/salaryCondition-service')


const ListSalaryConditions = (req, res, next ) => {
    logger.info('calling salary Condition API')
    salaryConditionService.listSalaryConditions()
    .then( (resp) => {
        return res.send(resp);
    })
    .catch( (err) => {
        logger.info('Salary condition List  API: error occures: ', err);
        return next(err);
    })
}

module.exports = { ListSalaryConditions }