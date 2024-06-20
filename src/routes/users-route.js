const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');
const userValidator = require('../validator/user-validator');
const loginValidator = require('../validator/login-validator')
const Auth = require('../middleware/auth-middleware');
const contentCheck=require('../middleware/content-type.middleware')

/* GET users listing. */
router.post('/',contentCheck.checkContentTypeJson, userValidator.validate('create'), userController.create);
router.put('/verify',contentCheck.checkContentTypeJson, loginValidator.validate('refresh'), userController.verifyEmail);
router.put('/resend/mail',contentCheck.checkContentTypeJson, userValidator.validate('resend-email'), userController.resendVerifyEmail);
router.get('/details',Auth,  userController.getUserDetails);
module.exports = router;
