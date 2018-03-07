from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask.json import jsonify
from influencer import *
from flask_cors import CORS
import json
import stripe
import os
import sys
sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/yougod/yougod/')
from scrape_engine import *
#sys.path.insert(0, '/Users/mark/Desktop/sapie/backend/campaign')
#from campaign import *

app = Flask(__name__)
CORS(app)

stripe.api_key = 'sk_live_QXvUGMApgvJE8W7PSkVSs8xo'

plan = stripe.Plan.create(
  product={'name': 'monthly'},
  nickname='monthly',
  interval='month',
  currency='usd',
  amount=29900,
)

plan = stripe.Plan.create(
  product={'name': 'Yearly'},
  nickname='yearly',
  interval='year',
  currency='usd',
  amount=329900,
)

plan = stripe.Plan.create(
  product={'name': 'Early'},
  nickname='early',
  interval='month',
  currency='usd',
  amount=14900,
)

@app.route("/")
def home():
    return "hi"

@app.route('/run_query', methods=['GET', 'POST'])
def run_query():
    print("in query")
    json_input = json.loads(request.data)
    print("GEGEEGE")
    print(json_input['queryString'])
    query_result = Influencer.query(str(json_input['queryString']))
    print(query_result)
    print(type(query_result))
    if len(query_result) <= 5:
        search_list_by_keyword(part='snippet', maxResults=25, q=str(json_input['queryString']))
        query_result = Influencer.query(str(json_input['queryString']))
    print("returning query")
    return jsonify({'query_results': query_result})

@app.route('/create_campaign', methods=['GET', 'POST'])
def create_campaign():
    json_input = json.loads(request.data)
    campaign = Campaign(json_input['company_name'])

@app.route('/charge_yearly', methods=['POST'])
def charge_yearly():
    print("in charge be_rest_api")

    #YEARLY SUBSCRIPTIONS
    json_input = json.loads(request.data)
    token = json_input['stripeToken']
    email_input = json_input['stripeEmail']

    customer = stripe.Customer.create(
        email = email_input,
        source=token,

    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{'plan': 'plan_CRLOE39msGhBfc'}],
    )
    return jsonify({'subscription': subscription})


@app.route('/charge_early', methods=['POST'])
def charge_early():
    print("in charge be_rest_api")

    #YEARLY SUBSCRIPTIONS
    json_input = json.loads(request.data)
    token = json_input['stripeToken']
    email_input = json_input['stripeEmail']

    customer = stripe.Customer.create(
        email = email_input,
        source=token,

    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{'plan': 'plan_CRLOxGBhLxSduz'}],
    )
    return jsonify({'subscription': subscription})


@app.route('/charge_monthly', methods=['POST'])
def charge_monthly():
    print("in charge be_rest_api")

    #MONTHLY SUBSCRIPTIONS
    json_input = json.loads(request.data)
    token = json_input['stripeToken']
    email_input = json_input['stripeEmail']

    customer = stripe.Customer.create(
        email = email_input,
        source=token,
    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{'plan': 'plan_CRlMXL8BNJ87SN'}],
    )
    print(subscription.id)
    return jsonify({'subscription': subscription})


@app.route('/cancel_subscription', methods=['POST'])
def cancel_subscription():

    json_input = json.loads(request.data)
    sub_id = json_input['subscription_id']

    subscription = stripe.Subscription.retrieve(sub_id)
    subscription.delete(at_period_end = False)

    return jsonify({'date': subscription.ended_at})


if __name__ == "__main__":
    app.run(host='ec2-34-209-86-220.us-west-2.compute.amazonaws.com', port=5000)
    #app.run(host='172.31.26.107', port=5000)
    #app.run(debug=True)
