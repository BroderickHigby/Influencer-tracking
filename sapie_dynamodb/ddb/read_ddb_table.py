from __future__ import print_function
import boto3
import json
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

class DecimalEncoder(json.JSONEncoder):
	def default(self,o):
		if isinstance(o, decimal.Decimal):
			if o % 1 > 0:
				return float(o)
			else:
				return int(o)
		return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource("dynamodb", region_name='us_west_2', endpoint_url="http://localhost:8000")

table = dynamodb.Table('influencerglobal')

socialauthority = 5
externalid = "Agencectrl"

try: 
	response = table.get_item(
		Key={
			'socialauthority': socialauthority,
			'externalid': externalid
		}
	)
except ClientError as e:
	print(e.response['Error']['Message'])
else:
	item = response['Item']
	print("GetItem succeeded: ")
	print(json.dumps(item, indent=4, cls=DecimalEncoder))