const express = require('express');
const careerCounsellingController=require('../controllers/careerCounselling-controller')
const router = express.Router();
const careerCounsellingValidator=require('../validator/careerCounselling-validators')
const contentCheck=require('../middleware/content-type.middleware');
const Auth = require('../middleware/auth-middleware');

router.post('/apply',Auth,careerCounsellingController.applyCareerCounselling);
router.post('/user/apply',contentCheck.checkContentTypeJson,careerCounsellingController.applyCareerCounsellingWithoutAuth);
module.exports = router;