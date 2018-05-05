from flask import request
from '../ML/CalculateOptimalInfluencers' import *
from '../UrlGenerator' import *
from '../DatabaseInterface' import *
from '../AutoContact' import *
from '../Client' import *

app = Flask(__name__)


@app.route('/create_campaign')
def api_create_campaign():
    calc_optimal_influencers = CalculateOptimalInfluencers()
    url_generator = UrlGenerator()
    optimal_influencers = calc_optimal_influencers.get_optimal_influencers()
    url_generator.generate_and_add_url_for_influencers_in_list(optimal_influencers)

    DatabaseInterface.write_campaign_to_db()
    AutoContact.contact_influencers(optimal_influencers, request)

    if 'name' in request.args:
        return 'Hello ' + request.args['name']
    else:
        return 'Hello John Doe'


@app.route('/create_client')
def api_create_client():
    client = Client(request['client_id'], request['industries'], request['contact_email'], request['contact_phone'])
    DatabaseInterface.write_client_to_db(client)


@app.route('/process_event/<campaign_id>')
def show_post(post_title):


if __name__ == '__main__':
    app.run()