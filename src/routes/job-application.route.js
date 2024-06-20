const express = require('express');
const jobApplicationRouter = express.Router();
const jobApplicationController = require('./../controllers/job-application.controller');
const Auth = require('../middleware/auth-middleware');
const contentCheck=require('../middleware/content-type.middleware')
// post a new job application 
jobApplicationRouter.post("/",contentCheck.checkContentTypeJson,Auth,jobApplicationController.createJobApplication);

module.exports = jobApplicationRouter;
