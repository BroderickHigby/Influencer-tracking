from __future__ import print_function
import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key, Attr

# Helper class to convert a DynamoDB item to JSON
class DecimalEncoder(json.JSONEncoder):

	def default(self,o):
		if isinstance(o, decimal.Decimal):
			if o % 1 > 0:
				return float(o)
			else:
				return int(o)
		return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb', region_name='us_west_2', endpoint_url="http://localhost:8000")

table = dynamodb.Table('influencerglobal')

print("Influencers with a score of 5 out- of " + str(table.item_count) + " influencers:")

response = table.query(
	TableName="influencerglobal",
	IndexName="socialauthorityindex",
	ProjectionExpression="#ind, info.friends", # This requests what to show in the response JSON
	ExpressionAttributeNames={"#ind": "industry"}, # Substitutes a name for an abbreviated name, i.e. ind
	# KeyConditionExpression=Key('industry').eq('seo')
	KeyConditionExpression=Key('industry').eq('seo') # This is the key for the GlobalSecondaryIndex, eq obviously shows what industry I'm looking for
)

for i in response['Items']:
	# print(i['industry'], ":", i['externalid'])
	print(i['industry'])
