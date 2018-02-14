import sys
import os
root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'yougod')
from scrape_engine import *
import industries

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
client = get_authenticated_service()

for industry in industries.industries:
    print(industry)
    search_list_by_keyword(client,
        part='snippet',
        maxResults=25,
        q=industry,
        type='')
    print('---------')
