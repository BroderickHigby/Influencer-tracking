from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask.json import jsonify
from influencer import *
from flask_cors import CORS
from nltk..stem.wordnet import WordNetLemmatizer
import json
import stripe
import os
import sys
import csv
import time
import ssl


context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain('/etc/letsencrypt/live/app.sapie.space/cert.pem','/etc/letsencrypt/live/app.sapie.space/privkey.pem')

sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/yougod/yougod/')
from scrape_engine import *
#sys.path.insert(0, '/Users/mark/Desktop/sapie/backend/campaign')
#from campaign import *

app = Flask(__name__)

# CORS(app)

stripe.api_key = 'sk_live_QXvUGMApgvJE8W7PSkVSs8xo'
#stripe.api_key = 'sk_test_UUgREeF3vNIfwJoB2UZj0oyB'


@app.route("/")
def home():
    return "hi"

@app.route('/run_query', methods=['GET', 'POST'])
def run_query():
    print("in query")
    json_input = json.loads(request.data)
    lmtzr = WordNetLemmatizer()
    print("Running query")
    print(json_input['queryString'])
    lemming = lmtzr.lemmatize(str(json_input['queryString']))
    print(lemming)

    fields = [lemming, time.strftime("%Y-%m-%d %H:%M"), str(json_input['user_email'])]
    with open(r'query_logs', 'a') as f:
      writer = csv.writer(f)
      writer.writerow(fields)

    query_result = Influencer.query(lemming)
    print(query_result)
    print(type(query_result))
    if len(query_result) <= 5:
        search_list_by_keyword(part='snippet', maxResults=25, q=lemming)
        query_result = Influencer.query(lemming)
    print("returning query")
    return jsonify({'query_results': query_result})

'''
@app.route('/create_campaign', methods=['GET', 'POST'])
def create_campaign():
    json_input = json.loads(request.data)
    campaign = Campaign(json_input['company_name'])
'''

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

    #change to actual email later
    if email_input == "rl@excelerationcapital.com":
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[{'plan': 'plan_CgyQc5NjADEVfY'}],
        )
    else:
        #plan_CSVM2aXa9UW6NF
        #plan_CRlMXL8BNJ87SN
        subscription = stripe.Subscription.create(
            customer=customer.id,
            #$300 items=[{'plan': 'plan_CRlMXL8BNJ87SN'}],
            #100/month items=[{'plan': 'plan_CcXaxLjrQvaJhg'}],
            #Test items=[{'plan': 'plan_CSVSQ57kADdOlh'}],
            items=[{'plan': 'plan_CdPky2a1798SMi'}]

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

@app.route('/post_twitter_influencer', methods=['POST'])
def post_twitter_influencer():
    json_input = json.loads(request.data)
    influencer.Influencer.create(json_input.item, json_input.screen_name)

app.run(host='ec2-34-209-86-220.us-west-2.compute.amazonaws.com', port=5000, debug=True, ssl_context=context)
context = ("./host.cert","./host.key")

# FOR LOCAL HOST - Uncomment app.run(host=...
# app.run(host='localhost', port=5000, debug=True)