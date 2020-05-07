const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('config');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  region: 'us-east-1',
});

const uploadImage = async (key, file, type) => {
  const params = {
    Bucket: 'saphi',
    Key: key,
    ContentType: type,
    Body: fs.readFileSync(file.path),
    ACL: 'public-read',
  };

  await s3.putObject(params).promise();
  const url = `https://${config.get('BUCKET')}.s3.amazonaws.com/${key}`;
  return url;
};

module.exports = {
  uploadImage,
};
