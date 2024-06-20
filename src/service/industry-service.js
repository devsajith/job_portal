const { BadRequest} = require('../utils/errors');
const logger  = require('../utils/logger-util');
const Industry = require('../model/industry.model');
const IndustryListView = require('../view/industry-list.view');
const industryType = require('../types/industry-type');


const listAllIndustry = async( ) => {
    let industryList = await Industry.findAll({

        order: [ ['created_date','DESC'] ],
        where:{
            status: industryType.ACTIVE
        }
    });

     return new IndustryListView( industryList );
}

module.exports = { listAllIndustry }