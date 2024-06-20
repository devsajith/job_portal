
const { body, validationResult } = require('express-validator');
const bullhornService = require('./../service/bullhorn-service');
const blogService = require("../service/blog-service");

const listAll  =async (req, res, next) => {
   await blogService.listAll({ where: { status:1 } })
        .then((response) => {
            
            res.send(response)
            
        })
        .catch((error) => {
          
            next(error)
        })
     
        //const value =await bullhornService.generateAccessToken()
    //    console.log(value)
        
}
const listone  = (req, res, next) => {
    const blogId = req.params.id;
    blogService.listOne(blogId)
        .then((response) => {
            res.send(response)

        })
        .catch((error) => {
          
            next(error)
        })
}


module.exports = {listAll,listone};