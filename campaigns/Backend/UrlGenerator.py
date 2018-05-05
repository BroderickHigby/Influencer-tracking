from ConfigBackend import *
import requests
import json

class UrlGenerator():
    @staticmethod
    def generate_and_add_url_for_each_influencers_in_list(influencer_list, client_id, campaign_id):
        for influencer in influencer_list:
            query_params = {'access_token': BITLY_API_KEY,
                            'longUrl': app_root_url + '/' + process_conversion + '/' + client_id + '/' + influencer['_id'] + '/' + campaign_id}
            endpoint = 'https://api-ssl.bitly.com/v3/shorten'
            response = requests.get(endpoint, params=query_params, verify=False)

            data = json.loads(response.content)
            print(data)
            influencer['bitly_url'] = data['url']

