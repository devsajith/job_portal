const { BadRequest} = require('../utils/errors');
const checkContentTypeJson = ( req, res, next) => {

    if (!req.is('application/json')) {
        
        next(new BadRequest("1004-content type should be application/json"))
    } else {
        next()
    }

}
const checkContentTypeMultipart = ( req, res, next) => {

    if (!req.is('multipart/form-data')) {
        
        next(new BadRequest("1005-content type should be multipart/form-data"))
    } else {
        next()
    }

}
module.exports={checkContentTypeJson,checkContentTypeMultipart}