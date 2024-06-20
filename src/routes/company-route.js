const companyController = require("../controllers/company-controller");
const companyRouter = require("express").Router();
const validator = require('./../validator/company-validator');

companyRouter.get("/", validator.companyQueryParamsValidator, companyController.getCompany);
companyRouter.get("/popular", companyController.getPopularCompany);
companyRouter.get("/:id", companyController.getCompanyDetailById);

module.exports = companyRouter;
