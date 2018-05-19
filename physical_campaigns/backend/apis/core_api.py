from flask import request, redirect, Flask
import sys
sys.path.append('..')
from data_pipelines.DatabaseInterface import *
import uuid
from time import gmtime, strftime

app = Flask(__name__)

@app.route('/create_campaign', methods=['POST'])
def api_create_campaign():
    input = request.get_json()
    campaign_id = str(uuid.uuid4())
    created_at = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    DatabaseInterface.write_new_physical_campaign(input['physical_campaign'], campaign_id, created_at)
    with open("clients_to_contact.txt", "a") as myfile:
        myfile.write("%s || %s || %s || %s") % (input['client_id'], created_at, client_email, ends_at)


    #if 'name' in request.args:
    #    return 'Hello ' + request.args['name']
    #else:
    #    return 'Hello John Doe'


@app.route('/btle_ping', methods=['POST'])
def btle_ping():


@app.route('/get_results', methods=['POST'])
def get_results():

'''@app.route('/create_client')
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

'''

if __name__ == '__main__':
    app.run()