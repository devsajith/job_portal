const { query } = require('express-validator');
const errorMessage = require('../utils/error-code');
//company query params validator
exports.companyQueryParamsValidator = [
    query('pageNo')
        .optional()
        .isInt({ min: 1 })
        .withMessage(errorMessage.INVALID_PAGE_NO),
    query('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage(errorMessage.INVALID_PAGE_SIZE),
    query('industry_id')
        .optional()
        .custom(value => {
            //industry_id validation( checking for characters, empty string etc.)
            if (value != '') {
                return !(value.split(',').find(x => !/^\d+$/.test(x)));
            }
            return true;
        })
        .withMessage(errorMessage.INVALID_INDUSTRY_ID),
]