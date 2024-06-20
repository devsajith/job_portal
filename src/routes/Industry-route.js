const express = require('express');
const IndustryRouter = express.Router();
const industryController = require('./../controllers/Industry-contoller');

// Get industry List
IndustryRouter.get("/",industryController.listIndustry);

module.exports = IndustryRouter ;
