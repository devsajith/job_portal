const { body } = require('express-validator');
const errorMessage = require('../utils/error-code');
//inquiry validator
exports.inquiryValidator = [
    body('name')
        .exists().withMessage(errorMessage.Error_name_reqiured)
        .isString().withMessage(errorMessage.Error_name_string)
        .bail()
        .custom(value => {
            return value.trim().length < 1 ? false : true
        }).withMessage(errorMessage.Error_name_Empty)
        .isLength({ max: 100 })
        .withMessage(errorMessage.Error_name_Max_Exceeded),
    body('email')
        .exists().withMessage(errorMessage.Error_email_required)
        .isEmail()
        .withMessage(errorMessage.Error_invalid_email_format),
    body('question')
    .optional({checkFalsy: true})
        .isString()
        .withMessage(errorMessage.Error_question_inquiry_string)
        .bail()
        .custom(value => {
            return value.trim().length < 1 ? false : true
        }).withMessage(errorMessage.Error_question_inquiry_Empty)
        .isLength({ max: 500 })
        .withMessage(errorMessage.Error_question_Max_Exceeded),
    body('description')
        .optional({checkFalsy: true})
        .isString()
        .bail()
        .custom(value => {
            return value.trim().length < 1 ? false : true
        }).withMessage(errorMessage.Error_description_Empty)
        .isLength({ max: 1000 })
        .withMessage(errorMessage.Error_description_Max_Exceeded)
        
]