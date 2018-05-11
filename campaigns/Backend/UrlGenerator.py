from ConfigBackend import *
import requests
import json

class UrlGenerator():
    @staticmethod
    def generate_and_add_url_for_each_influencers_in_list(influencer_list, client_id, campaign_id):
        print("url gen start")
        for influencer in influencer_list:
            print('url gen loop start')
            query_params = {'access_token': BITLY_ACCESS_TOKEN,
                            'longUrl': app_root_url + '/' + process_conversion + '/' + client_id + '/' + influencer['id'] + '/' + campaign_id}
            endpoint = 'https://api-ssl.bitly.com/v3/shorten'
            print('doing bitly requests')
            response = requests.get(endpoint, params=query_params, verify=False)
            print('request done')
            data = json.loads(response.content)
            print(data)
            influencer['bitly_url'] = data['data']['url']
            print('-----')
