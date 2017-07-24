var AWS = require('aws-sdk');
var marshalItem = require('dynamodb-marshaler').marshalItem;
 
AWS.config.region = 'us-west-1';
var dynamoDb = new AWS.DynamoDB();
 
dynamoDb.putItem({
  TableName: 'seo',
  Item: marshalJson({"seo.json"})   
});