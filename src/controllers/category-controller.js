const { body, validationResult } = require('express-validator');

const CategoryService = require("../service/category-service");
const logger  = require('../utils/logger-util');


const listAllPickup  = (req, res, next) => {
    CategoryService.listAll()
        .then((response) => {
            res.send(response)
        })
        .catch((error) => {
          
            next(error)
        })
}

const getAllCategory = (req, res, next) => {

    logger.info("Calling category list API")
    CategoryService.listCategory()
    .then( (resp) => {
        return res.send(resp);
    })
    .catch( (err) => {
        return next(err);
    })
}


module.exports = {listAllPickup, getAllCategory };