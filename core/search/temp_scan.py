from __future__ import unicode_literals, print_function

import json
import boto3
import decimal

from boto3.dynamodb.conditions import Key, Attr
from django.db import models

class DecimalEncoder(json.JSONEncoder):

    def default(self,o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return (o)
        return super(DecimalEncoder, self).default(o)

# class ScanDynamoDB():
dynamodb = boto3.resource('dynamodb', region_name='us-west-2')
table = dynamodb.Table('influencers')
# Temporarily hard coded a search term to test the platform
search_term = "seo"
concat_search_term = "\'"+search_term+"\'"

# fe = Attr('industry').contains(concat_search_term) # & Attr('socialauthority').between(60,99)
# fe = Key('industry').eq(concat_search_term)
fe = Key(concat_search_term).between(60,99);
pe = "socialauthority, externalid, info.bio"
esk = None

response = table.scan(
    FilterExpression= fe,
    ProjectionExpression=pe
)
items = response['Items']
print(items)

# for i in response['Items']:
#     print(json.dumps(i, cls=DecimalEncoder))

    # This is for overflow, the call has limits of 16MB, 100 items, or an error
    # Ddb will return the LEK and then the process can resume where it ended
    # while 'LastEvaluatedKey' in response:
    #     response = table.scan(
    #         ProjectionExpression=pe,
    #         FilterExpression=fe,
    #         ExclusiveStartKey=response['LastEvaluatedKey']
    #     )
    # for i in response['Items']:
    #     print(json.dumps(i, cls=DecimalEncoder))

