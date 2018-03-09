import sys
import os
root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'yougod')
sys.path.insert(0, '/home/ec2-user/sapie/backend')
from scrape_engine import *
import industry_tags

for key, value in industry_tags.industry_search_terms.items():
    for search_term in value:
        print(search_term)
        search_list_by_keyword(part='snippet', maxResults=25, q=search_term)
        print('---------')
