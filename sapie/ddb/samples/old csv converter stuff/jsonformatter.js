var jsonfile = require('jsonfile');
var fs = require('fs-extra');
var _ = require('lodash');
var attr = require('dynamodb-data-types').AttributeValue;

var file = '/home/brody/sapiespace/db-sapie/seo.json';
var dataJson = jsonfile.readFileSync(file);
var dataResults = dataJson.results;
var dataArray = [];

console.log;

function loopy() 
{
	for (var i = 0; i < dataResults.length; i++)
	{
		var data = dataResults[i];
		data.user = data.user.objectId;
		delete data.updatedAt;
		delete data.objectId;
		dataArray.push(attr.wrap(data));
	}
}

loopy();
var ws = fs.createOutputStream('/home/brody/sapiespace/db-sapie/data/dataStream.ddb.json')
ws.write(JSON.stringify(dataArray));