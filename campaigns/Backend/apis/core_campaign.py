from flask import request, redirect, Flask
import sys
sys.path.append('..')
from ML.CalculateOptimalInfluencers import *
from UrlGenerator import *
from DatabaseInterface import *
import uuid

app = Flask(__name__)


@app.route('/process_new_goals')
def api_process_new_goals():
    campaign_id = str(uuid.uuid4())
    optimal_influencers = CalculateOptimalInfluencers.get_optimal_influencers()
    UrlGenerator.generate_and_add_url_for_each_influencers_in_list(optimal_influencers, request.args['client_id'], campaign_id)
    DatabaseInterface.write_campaign_to_db(request.args, optimal_influencers, campaign_id)
    return optimal_influencers


    #if 'name' in request.args:
    #    return 'Hello ' + request.args['name']
    #else:
    #    return 'Hello John Doe'


@app.route('/create_client')
def api_create_client():
    client = Client(request['client_id'], request['industries'], request['contact_email'], request['contact_phone'])
    DatabaseInterface.write_client_to_db(client)


@app.route('/process_conversion/<client_id>/<influencer_id>/<campaign_id>')
def process_conversion(client_id, influencer_id, campaign_id):
    DatabaseInterface.add_conversion_event(campaign_id, influencer_id)
    target_url = DatabaseInterface.get_target_url(client_id, campaign_id)

    return redirect(target_url, code=302)



@app.route('/get_clientid_results')
def api_get_clientid_results():
    return DatabaseInterface.get_campaign_results_for_client_id(request.args['client_id'])



if __name__ == '__main__':
    app.run()