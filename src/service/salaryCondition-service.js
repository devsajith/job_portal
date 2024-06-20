
const SalaryConditionModel = require('../model/salaryCondtion-model');
const SalaryConditionListView = require('../view/salary-condition.view');
const { BadRequest, NotFound } = require('../utils/errors');
const logger  = require('../utils/logger-util');
const salaryType = require('../types/salaryRange-type')

const listSalaryConditions = async() => {
    logger.info("Fetching salary condtions")
    let salaryCondtionObj = []
    try{
        salaryCondtionObj = await SalaryConditionModel.findAll({

            
            where:{
                type : 0
            }
        });
        console.log("salaryCondtionObj:  ",salaryCondtionObj);
    }
    catch( error){
        console.log(error)
        logger.warn('Db error salary  condtion list')
        throw new BadRequest('DB error');
    }
    logger.info('created salary list')
    return new SalaryConditionListView(salaryCondtionObj);


}

module.exports = { listSalaryConditions}