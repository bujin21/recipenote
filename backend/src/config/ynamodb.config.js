const AWS = require('aws-sdk');

// AWS SDK 설정
AWS.config.update({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// 테이블 이름
const TABLES = {
  MAIN: process.env.DYNAMODB_TABLE_NAME || 'recipenote-main'
};

module.exports = {
  dynamoDB,
  TABLES
};