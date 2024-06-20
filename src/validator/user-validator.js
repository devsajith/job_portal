const { body, query } = require('express-validator');
const CryptoJS = require('crypto-js');
const emojiRegex = require('emoji-regex');
const secretKey = 'XkhZG4fW2t2W';

const errorMessage = require('../utils/error-code');

const validate = (type) => {
    switch (type) {
        case 'create':
            return [
                body("fullName", errorMessage.NAME_REQUIRED).exists()
                    .isString()
                    .withMessage(errorMessage.FIRSTNAME_INVALID)
                    .notEmpty({ ignore_whitespace: true })
                    .withMessage(errorMessage.FIRSTNAME_INVALID)
                    .custom(value => {
                        return !(value.length < 1 || value.length > 50)
                    })
                    .withMessage(errorMessage.FIRSTNAME_INVALID)
                    .custom((value) => {
                        return !(emojiRegex().test(value));
                    })
                    .withMessage(errorMessage.FIRSTNAME_INVALID),
                body("middleName")
                    .optional()
                    .isString()
                    .withMessage(errorMessage.MIDDLE_NAME_INVALID)
                    .custom((value) => {
                        return !(emojiRegex().test(value));
                    })
                    .withMessage(errorMessage.MIDDLE_NAME_INVALID),
                body("lastName", errorMessage.LAST_NAME_REQUIRED)
                    .exists()
                    .isString()
                    .withMessage(errorMessage.LAST_NAME_INVALID)
                    .notEmpty({ ignore_whitespace: true })
                    .withMessage(errorMessage.LAST_NAME_INVALID)
                    .custom(value => {
                        return !(value.length < 1 || value.length > 50)
                    })
                    .withMessage(errorMessage.LAST_NAME_INVALID)
                    .custom((value) => {
                        return !(emojiRegex().test(value));
                    })
                    .withMessage(errorMessage.LAST_NAME_INVALID),
                body("email", errorMessage.EMAIL_REQURIED).exists()
                    .bail()
                    .isEmail()
                    .isLength({ max: 50 })
                    .withMessage(errorMessage.INCORRECT_MAIL_FORMAT),
                body("password", errorMessage.PASSWORD_REQUIRED).exists()
                    .custom(value => {
                        console.log(value)
                        // Decrypt
                        const decryptedText = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
                        console.log('Decrypted Text registration password:', decryptedText);

                        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-])?[A-Za-z\d~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-]{8,20}$/;
                        console.log(re.test(decryptedText));
                        return (re.test(decryptedText))
                    })
                    .withMessage(errorMessage.INCORRECT_PASSWORD_FORMAT),
                body("prefecture")
                    .optional()
                    // .exists()
                    // .withMessage(errorMessage.PREFECTURE_REQUIRED)
                    .isString()
                    // .notEmpty({ ignore_whitespace: true })
                    // .isLength({ min: 1, max: 500 })
                    .withMessage(errorMessage.INVALID_PREFECTURE),
                body("city")
                    .optional()
                    // .exists()
                    // .withMessage(errorMessage.CITY_REQUIRED)
                    .isString(),
                    // .notEmpty({ ignore_whitespace: true })
                    // .isLength({ min: 1, max: 500 })
                    // .withMessage(errorMessage.CITY_INVALID),
                body("apartmentName")
                    .optional()
                    .isString()
                    .withMessage(errorMessage.INVALID_APARTMENT_NAME),
                // body("dateOfBirth", errorMessage.DATE_OF_BIRT_REQUIRED).exists()
                //     .trim()
                //     .isDate()
                //     .withMessage(errorMessage.DOB_INVALID)
                //     .custom((dob) => {
                //         let birthDate = new Date(dob);
                //         return birthDate instanceof Date && birthDate < new Date()
                //     })
                //     .withMessage(errorMessage.DOB_INVALID),
                query('source')
                    .exists()
                    .isInt({ min: 0, max: 2 })
                    .withMessage(errorMessage.INVALID_SOURCE),
                body("telNumber")
                    .exists()
                    .withMessage(errorMessage.TELEPHONE_NUMBER_REQUIRED)
                    .isString()
                    .withMessage(errorMessage.INVALID_TELEPHONE_NUMBER),
                body("desiredOccupation")
                    .exists()
                    .withMessage(errorMessage.DESIRED_OCCUPATION_REQUIRED)
                    .isString()
                    .notEmpty({ ignore_whitespace: true })
                    .isLength({ min: 1, max: 150 })
                    .withMessage(errorMessage.INVALID_DESIRED_OCCUPATION),
                body("resume")
                    .optional()
                    .isString()
                    .withMessage(errorMessage.INVALID_RESUME),
            ]
        case 'email':
            return [
                body("token", errorMessage.TOKEN_REQUIRED).exists()
                    .bail()
                    .isString()
                    .notEmpty({ ignore_whitespace: true })
                    .withMessage(errorMessage.TOKEN_INVALID)
            ]
        case 'changePassword':
            return [
                body("oldPassword", errorMessage.OLD_PASSWORD_REQUIRED).exists()
                    .custom(value => {
                        // Decrypt
                        const decryptedText = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
                        console.log('Decrypted Text oldPassword:', decryptedText);

                        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-])?[A-Za-z\d~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-]{8,20}$/;
                        console.log(re.test(decryptedText))
                        return (re.test(decryptedText));
                    })
                    .withMessage("Invalid password"),
                body("newPassword", errorMessage.NEW_PASSWORD_REQUIRED).exists()
                    .custom(value => {
                        // Decrypt
                        const decryptedText = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
                        console.log('Decrypted Text newPassword:', decryptedText);
                        let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-])?[A-Za-z\d~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-]{8,20}$/;
                        return (re.test(decryptedText));
                    })
                    .withMessage(errorMessage.INVALID_PASSWORD)
            ]
        case 'resend-email':
            return [
                body("email", errorMessage.EMAIL_REQURIED).exists()
                    .bail()
                    .isEmail()
                    .isLength({ max: 50 })
                    .withMessage(errorMessage.INCORRECT_MAIL_FORMAT)
            ]
    }
}
module.exports = { validate };