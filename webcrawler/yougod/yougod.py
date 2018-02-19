import sys
import os
root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'yougod')
from scrape_engine import *
import industries

for key, value in industries.industry_search_terms.items():
    for search_term in value:
        print(search_term)
        search_list_by_keyword(part='snippet', maxResults=25, q=search_term)
        print('---------')
