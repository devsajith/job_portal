const storage = require('../middleware/storage.middleware');
const uploadfile = storage.single('uploadfile')
const { BadRequest } = require("../utils/errors");
const errorResponse = require('../utils/error-code')

const fileUpload = async (req, res, next) => {
    uploadfile(req, res, function (err, data) {
        if(err)
        {
            console.log(err)
        }
    
        if (req.file == undefined) {
            next(new BadRequest(errorResponse.FILE_REQUIRED))
        }
        else {
            if (err) {
                return res.status(400).send({ message: err.message });
            }
            else {
                console.log(req.file);
                return res.send({ filepath: req.file.key.replace('temp/', ''), location: req.file.location });
            }
        }
    });
};
module.exports = fileUpload;