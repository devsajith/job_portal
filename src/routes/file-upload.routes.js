const fileUploadController = require('../controllers/file-upload.controller');
const fileUploadRouter = require("express").Router();
const checkContentTypeMultipart = require('../middleware/content-type.middleware')

fileUploadRouter.post('/upload', checkContentTypeMultipart.checkContentTypeMultipart, fileUploadController);

module.exports = fileUploadRouter;