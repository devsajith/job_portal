    const { Logger } = require("winston");
    const { GeneralError } = require("../utils/errors");
    const logger = require('../utils/logger-util');

    const handleErrors = (err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            return res.status(400).send({ errorCode: 1003, errorMessage: "invalid syntax of body " }); 
        }
        
        if (err instanceof GeneralError) {
            
            
            let errorMessage = err.message.split("-");
            if(errorMessage.length == 2){
                return res.status(err.getCode()).json({
                
                    errorCode: errorMessage[0],
                    errorMessage: errorMessage[1]
                })
            }

            return res.status(err.getCode()).json({
                
                errorCode: (err.errorCode == null? err.getCode():err.errorCode) ,
                errorMessage: err.message
            })
        }
        logger.error(`Uncatched error occurred ${err}`)

        return res.status(400).json({
            errorMessage: err.message
        })
    }

    module.exports = handleErrors;