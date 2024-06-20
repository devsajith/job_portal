const logger  = require('../utils/logger-util');
const salaryService = require('../service/salary-service')


const ListSalary = (req, res, next ) => {
    logger.info('calling salary  API')
    salaryService.listSalary()
    .then( (resp) => {
        return res.send(resp);
    })
    .catch( (err) => {
        logger.info('Salary API: error occures: ', err);
        return next(err);
    })
}

module.exports = { ListSalary }