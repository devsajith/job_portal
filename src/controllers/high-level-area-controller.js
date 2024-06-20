
const { error } = require('winston');
const higgLevelAreaService = require('../service/high-level-area-service')
const logger  = require('../utils/logger-util');

const getHighLevelArea = async(req, res, next ) => {

    logger.info("Fetching hign level area");
    higgLevelAreaService.getHighLevelArea()
    .then( (resp) =>{
        return res.send(resp)
    })
    .catch( (err) =>{
        logger.error("Error occured ferching area: ", error);
        return next(err);
    })

}

module.exports= { getHighLevelArea };