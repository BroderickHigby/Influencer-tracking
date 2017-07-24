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

The most optimal approach to accessing the table, from what I can tell, is to partition by social authority (sorting by externalid, for uniqueness) and to access a global index via industry (and sorting with externalid again). 
"""

dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

table = dynamodb.create_table(
	TableName='influencers',
	KeySchema=[
		{
            'AttributeName': 'socialauthority',
		    'KeyType': 'HASH'
		},
		{
	        'AttributeName': 'externalid',			    
		    'KeyType': 'RANGE'
		}
	],
	AttributeDefinitions=[
	    {
	        'AttributeName': 'socialauthority',
	        'AttributeType': 'N'
	    },
	    {
	        'AttributeName': 'externalid',	    
	        'AttributeType': 'S'
	    },
	    { # Index's attributes need to be declared as well
	        'AttributeName': 'industry',
	        'AttributeType': 'S'
	    }
    ],
    GlobalSecondaryIndexes=[
        {
            'IndexName': 'socialauthorityindex',
            'KeySchema': [
                {
                    'AttributeName': 'industry',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'externalid',
                    'KeyType': 'RANGE'
                },
            ],
            'Projection': {
                'ProjectionType': 'ALL',

            },
            'ProvisionedThroughput': {
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        },
    ],
    ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
)

# Wait until the table exists.
# table.meta.client.get_waiter('table_exists').wait(TableName='one')

print (table.item_count)
print("Table status:", table.table_status)