
const HighLevelLocation = require('../model/highLevelLocation-model');
const Prefecture = require('../model/prefecture-model');
const { NotFound, InternalServerError } = require('../utils/errors');
const AreaListView = require('../view/area-list.view');
const logger  = require('../utils/logger-util');
const highLevelLocationType = require ('../types/highLevelLocation-type')


const getHighLevelArea = async() => {

    //fetching high level area
    let highLevelLocation = [];
    try{
        highLevelLocation = await HighLevelLocation.findAll({ 

          order: [ ['created_date','DESC'] , [ Prefecture ,'updated_date','DESC' ]  ],
          where:{
              status:highLevelLocationType.ACTIVE
          },
          include: Prefecture });
    }
    catch(error){
      console.log(error)
      throw new InternalServerError('DB error');

    }
    logger.info("existing process");
    logger.info("Creating area list view");
    return new AreaListView(highLevelLocation);
}

module.exports = { getHighLevelArea };
