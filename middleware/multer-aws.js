const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');


// config S3
aws.config.update({
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
region: process.env.AWS_DEFAULT_REGION,
});

const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  bucket: `${process.env.AWS_BUCKET_NAME}`,
  key: function (req, file, cb) {
    // console.log(file);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;