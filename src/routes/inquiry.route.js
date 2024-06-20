const express = require('express');
const inquiryRouter = express.Router();
const inquiryController = require('./../controllers/inquiry.controller');
const validator = require('./../validator/inquiry.validator');
const contentCheck=require('../middleware/content-type.middleware')
//post a new inquiry request 
inquiryRouter.post("/", contentCheck.checkContentTypeJson,validator.inquiryValidator, inquiryController.createInquiry);
module.exports = inquiryRouter;
