const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login-controller');
const loginValidator = require('../validator/login-validator')
const contentCheck=require('../middleware/content-type.middleware')

router.post('/',contentCheck.checkContentTypeJson,loginValidator.validate('login'), loginController.login);
router.post('/forgot-password',contentCheck.checkContentTypeJson,loginValidator.validate('forgot-password'), loginController.forgotPassword);
router.put('/forgotPasswordValidate', contentCheck.checkContentTypeJson,loginValidator.validate('forgot-password-validate'), loginController.validateForgotPassword);
router.put('/',contentCheck.checkContentTypeJson, loginValidator.validate('refresh'), loginController.refreshToken);

module.exports = router;