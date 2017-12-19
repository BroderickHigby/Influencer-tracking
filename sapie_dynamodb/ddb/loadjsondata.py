from __future__ import print_function # Python 2/3 compatibility
import boto3
import json
import decimal

dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url="http://localhost:8000")

table = dynamodb.Table('seo')

with open("example_json.json") as json_file:
    influencers = json.load(json_file)
    for influencer in influencers:
        externalid = json.loads("external_id")
        socialauthority = int(influencer['socialauthority'])
        info = influencer['info']

        print("Adding influencer:", external_id, social_authority)

        table.put_item(
           Item={
               'externalid': externalid,
               'socialauthority': socialauthority,
               'info': info,
            }
        )