const { body } = require('express-validator');
const errorMessage = require('../utils/error-code');
//inquiry validator
const validate = () => {

    return [
        body('email')
            .exists().withMessage(errorMessage.Error_email_required)
            .isEmail().withMessage(errorMessage.Error_invalid_email_format),

        body('questions', errorMessage.Error_question_required)
            .exists()
            .isArray({ min: 1 }),
        body('questions.*').isLength({ max: 100 }).withMessage(errorMessage.Error_question_length)
            .isString().withMessage(errorMessage.Error_question_string)
            .bail()
            .custom(value => {
                return value.trim().length < 1 ? false : true
            }).withMessage(errorMessage.Error_question_Empty),
        body('answers.*').isLength({ max: 100 }).withMessage(errorMessage.Error_answer_length)
            .isString().withMessage(errorMessage.Error_answer_string)
            .bail()
            .custom(value => {
                return value.trim().length < 1 ? false : true
            }).withMessage(errorMessage.Error_answer_Empty),

        body('answers', errorMessage.Error_answer_required)
            .exists()
            .isArray({ min: 1 }),
    ]
}

module.exports = { validate };