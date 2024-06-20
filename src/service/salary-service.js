
const Salary = require('../model/salary-model');
const SalaryListView = require('../view/salary-list.view');
const { BadRequest, NotFound } = require('../utils/errors');
const logger  = require('../utils/logger-util');
const salaryType = require('../types/salaryRange-type')

const listSalary = async() => {
    logger.info("Fetching salary")
    let salaryObj = []
    try{
        salaryObj = await Salary.findAll({

            order: [ ['created_date','DESC'] ],
            where:{
                status : salaryType.ACTIVE
            }
        });
    }
    catch( error){
        logger.warn('Db error salary list')
        throw new BadRequest('DB error');
    }
    logger.info('created salary list')
    return new SalaryListView(salaryObj);


}

module.exports = { listSalary}