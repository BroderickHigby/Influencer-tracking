from __future__ import print_function
import boto3
import json
import decimal

dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")

table = dynamodb.Table('seo')

with open("sample_seo.json") as json_file:
	seo = json.load(json_file, parse_float = decimal.Decimal)
	for seo_new in seo:
		external_id = seo_new['external_id']
		social_authority = int(seo_new['social_authority'])
		info = seo_new['info']

		print("Adding data:", external_id, social_authority)

		table.put_item(
			Item={
			    'external_id': external_id,
			    'social_authority': social_authority,
			    'info': info,
		    }
	    )