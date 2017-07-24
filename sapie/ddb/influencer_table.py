from __future__ import print_function
import boto3

"""
The 'tags' and social_authority are the only keys, because those are what's searched. 

The Influencer table requires the following Attributes:
	- externalID
	- screen_name 
	- social_authority
	- num_followers
	- num_tweets
	- name
	- description
	- picture_url
	- being_processed
 	- url 
	- tags

endpoint_url indicates that it's local-only.
"""

dynamodb = boto3.resource('dynamodb', region_name='us-west-2', endpoint_url='http://localhost:8000')

table = dynamodb.create_table(
	TableName='seo',
	KeySchema=[
		{
		    'AttributeName': 'external_id',
		    'KeyType': 'HASH'
		},
		{
		    'AttributeName': 'social_authority',
		    'KeyType': 'RANGE'
		}
	],
	AttributeDefinitions=[
	    {
	        'AttributeName': 'external_id',
	        'AttributeType': 'S'
	    },
	    {
	        'AttributeName': 'social_authority',
	        'AttributeType': 'N'
	    }
    ],
    ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
)

# Wait until the table exists.
table.meta.client.get_waiter('table_exists').wait(TableName='users')

print (table.item_count)
print("Table status:", table.table_status)