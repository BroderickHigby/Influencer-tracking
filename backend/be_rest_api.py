from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask.json import jsonify
from influencer import *
from flask_cors import CORS
import json
import stripe
import os

app = Flask(__name__)
CORS(app)

stripe.api_key = 'sk_test_UUgREeF3vNIfwJoB2UZj0oyB'

plan = stripe.Plan.create(
  product={'name': 'Monthly'},
  nickname='Basic monthly',
  interval='month',
  currency='usd',
  amount=29900,
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
    print("returning query")
    return jsonify({'query_results': query_result})

@app.route('/charge', methods=['POST'])
def charge():
    print("in charge be_rest_api")

    #SUBSCRIPTIONS
    json_input = json.loads(request.data)
    token = json_input['stripeToken']
    email_input = json_input['email']

    customer = stripe.Customer.create(
        email = email_input,
    )

    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{'plan': 'plan_CNCEG6DoqmaTDo'}],
        source=token,
    )

    #ONE TIME PAYMENT
    '''
    amount = 29900
    json_input = json.loads(request.data)
    token = json_input['stripeToken']

    #token = request.form['stripeToken']

    charge = stripe.Charge.create(
        amount=amount,
        currency='usd',
        description='Flask Charge',
        source=token,
    )
    '''

    return "Charge completed"

if __name__ == "__main__":
    app.run(host='ec2-34-209-86-220.us-west-2.compute.amazonaws.com', port=5000)
    #app.run(host='172.31.26.107', port=5000)
