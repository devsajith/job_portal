const { body } = require('express-validator');
const CryptoJS = require('crypto-js');
const secretKey = 'XkhZG4fW2t2W';

const errorMessage = require('../utils/error-code');

const validate = (type) => {

    switch (type) {

        case 'login':
            return [
                body("email", errorMessage.USERNAME_REQUIRED).exists()
                    .bail()
                    .isEmail()
                    .withMessage(errorMessage.LOGIN_INVALID_EMAIL)
                    .isLength({ max: 50 })
                    .withMessage(errorMessage.LOGIN_INVALID_EMAIL),

                body("password", errorMessage.LOGIN_PASSWORD_REQUIRED).exists()
                    .custom(value => {
                        console.log(value)
                        // Decrypt
                        const decryptedText = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
                        console.log('Decrypted Text login password:', decryptedText);
                        
                        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-])?[A-Za-z\d~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-]{8,20}$/;
                        console.log(re.test(decryptedText))
                        return (re.test(decryptedText))
                    })
                    .withMessage(errorMessage.LOGIN_INVALID_PASSWORD)
            ]
        case `forgot-password-validate`:
            return [
                body("token", errorMessage.TOKEN_REQUIRED).exists()
                    .bail()
                    .isString()
                    .withMessage(errorMessage.TOKEN_INVALID)
                    .notEmpty({ ignore_whitespace: true })
                    .withMessage(errorMessage.TOKEN_INVALID),

                body("password", errorMessage.PASSWORD_REQUIRED).exists()
                    .custom(value => {
                        console.log(value)
                        // Decrypt
                        const decryptedText = CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
                        console.log('Decrypted Text forgot-password-validate:', decryptedText);
                        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-])?[A-Za-z\d~!@#$%^&*()_+={}\[\]>?.<|:;'',`"/\\-]{8,20}$/;
                        console.log(re.test(decryptedText))
                        if (!re.test(decryptedText)) {
                            console.log(!re.test(decryptedText));
                            return false;
                        }
                        return true;
                    })
                    .withMessage(errorMessage.INVALID_PASSWORD)
            ]

        case 'forgot-password':
            return [
                body("email", errorMessage.FORGOT_PASSWORD_EMAIL_REQUIRED).exists()
                    .bail()
                    .isEmail()
                    .isLength({ max: 50 })
                    .withMessage(errorMessage.INCORRECT_MAIL_FORMAT),
            ]

        case 'refresh':
            return [
                body("token", errorMessage.TOKEN_REQUIRED).exists()
                    .bail()
                    .isString()
                    .withMessage(errorMessage.TOKEN_INVALID)
            ]

    }


}

module.exports = { validate };