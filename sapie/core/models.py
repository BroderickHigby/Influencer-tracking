from __future__ import print_function
import boto3
import json

dynamodb = boto3.resource('dynamodb', region_name = 'us-west-2')
table = dynamodb.Table('influencers')

class Tweet():
    response = table.put_item(
        Item=(
            'external_id' =
            'social_authority' =
            'influencer' =
            'num_followers' =
            'num_tweets' =
            'name' =
            'description' =
            'picture_url' =
            'being_processed' =
            'url' =
            'tags' =

            'whois_emails' =

            'created_on' =
            'updated_on' =
        )
    )