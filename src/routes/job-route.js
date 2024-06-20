const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job-controller');
const jobApplicationController = require('./../controllers/job-application.controller');
const contentCheck=require('../middleware/content-type.middleware')

router.get('/hotjob', jobController.listAllHotjob);
router.get('/details/:id', jobController.jobDetails);
router.get('/list', jobController.getJobList );
router.post("/user/apply/:userId",contentCheck.checkContentTypeJson,jobApplicationController.createJobApplicationWithoutAuth);

module.exports = router;
