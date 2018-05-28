from flask import request, redirect, Flask
import sys
sys.path.append('..')
from ML.CalculateOptimalInfluencers import *
from UrlGenerator import *
from DatabaseInterface import *
import uuid

app = Flask(__name__)


'''@app.route('/process_new_goals', methods=['POST'])
def api_process_new_goals():
    input = request.get_json()
    print("meow")
    campaign_id = str(uuid.uuid4())
    print('meow2')
    optimal_influencers = CalculateOptimalInfluencers.get_optimal_influencers()
    print(request.get_json())
    print('meow3')
    UrlGenerator.generate_and_8add_url_for_each_influencers_in_list(optimal_influencers, input['client_id'], campaign_id)
    print('meow4')
    DatabaseInterface.write_campaign_to_db(input, optimal_influencers, campaign_id)
    print('hiss')
    return optimal_influencers'''


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
    input = request.get_json()
    return DatabaseInterface.get_campaign_results_for_client_id(input['client_id'])

@app.route('/create_campaign', methods=['POST'])
def create_campaign():
    campaign_id = str(uuid.uuid4())
    input = request.get_json()
    location = input['location']
    age_demographic = input['age_demographic']
    industries = input['industries']
    goals = input['goals']
    mpaa_rating = input['mpaa_rating']
    brand_feel = input['brand_feel']
    budget = input['budget']
    other_info = input['other_info']
    DatabaseInterface.write_digital_campaign_to_db(campaign_id, location, age_demographic, industries, goals, mpaa_rating, brand_feel, budget, other_info)


if __name__ == '__main__':
    app.run(port=6963)