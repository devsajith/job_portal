const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortId = require('shortid');
const customContentType = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, 'application/pdf');
    } else {
        cb(null, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
};
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        return cb(new Error('Invalid file type'));
    }
    cb(null, true);
};
let s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});
const uploadStorage = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        contentType: customContentType,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, 'temporary/' + shortId.generate() + '-' + Date.now() + "image");
        },
    }), fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 15 }
});
module.exports = uploadStorage;