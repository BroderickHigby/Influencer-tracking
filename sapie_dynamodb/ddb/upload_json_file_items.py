from __future__ import print_function
import boto3
import json
import decimal


dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

table = dynamodb.Table('influencers')


# json_data = json.loads(open('example_json.json').read())

# This ended up working with the proper CSV file, in my case "example_json.json"
with open("marketing.json") as json_file:
    json_data = json.load(json_file, parse_float = decimal.Decimal)
    for influencers in json_data:
		socialauthority = int(influencers['socialauthority'])
		externalid = influencers['externalid']
		info = influencers['info']

		print("Adding Influencer: ", externalid, socialauthority)

		table.put_item(
			Item={
				'externalid': externalid,
				'socialauthority': socialauthority,
				'info': info,
				'industry': "marketing"
			}
		)

# print(json_data["externalid"])
