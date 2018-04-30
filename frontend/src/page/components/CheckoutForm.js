import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import { getCurrentUser, updateCustomAttributes, getAttributes } from '../../libs/awsLib.js';
import CardSection from './CardElement.js';
import axios from 'axios';

const trialButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '5px',
  color: 'white',
  padding: '10px 10px',
  border: '1px',
  fontSize: '1em'
}

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(ev) {
    ev.preventDefault();

    var emailUser = "";

    var attributes = await getAttributes();
    console.log(attributes);
    var i =0;

    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "email") {
        emailUser = attributes[i].Value;
      }
    }


    this.props.stripe.createToken({name: getCurrentUser().username}).then(({token}) => {
      console.log('Received Stripe token:', token);
      var postData = {
          stripeToken: token.id,
          stripeEmail: emailUser
      };

      let axiosConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*"
          }
      };

      /* Add again when using dropdown menu
      var e = document.getElementById("plans");
      var strUser = e.options[e.selectedIndex].value;
      console.log("Plan " + strUser);
      */

      var route = "";
      route = 'https://app.sapie.space/xapi/charge_monthly';
      //route = 'http://127.0.0.1:5000/charge_monthly';

      /* Add again when using dropdown menu
      if (strUser === "Monthly") {
        route = 'http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/charge_monthly';
      }
      else if (strUser === "Yearly") {
        route = 'http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/charge_yearly';
      }
      else if (strUser === "Early") {
        route = 'http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/charge_early';
      }
      else {
        console.log("No plan selected");
        window.location = "/app/subscribe"
      }
      */

      axios.post(route, postData, axiosConfig)
      .then(async function (response) {

        var subs = response.data.subscription;
        var subscription_id = subs.id;

        const attributeList= [
          new CognitoUserAttribute({
            Name: 'custom:subs_id',
            Value: subs.id
          }),
          new CognitoUserAttribute({
            Name: 'custom:subs_type',
            // Value: strUser
            Value: "Monthly"
          }),
          new CognitoUserAttribute({
            Name: 'custom:subs_active',
            Value: "true"
          })
        ]
        /*
          Save the subscription_id to the the user in cognito with the
          email user_email. The subscription_id is used to cancel the subscription
          later on.
          Allow access to payed authenticated routes and now display
          Unsubscribe page instead of subscribe page.
        */

        await updateCustomAttributes(attributeList);

        window.location = "https://app.sapie.space/app/signupconfirm"

      }).catch(error => {
        console.log(error)
      });
    });

  }

  render() {
    return (

      <center>

        <form onSubmit={this.handleSubmit}>
          <div style={{width:'100%', padding: '12px 20px', background: '#f9f9fa', border: '1px', borderStyle: 'solid', borderColor: '#f9f9fa', borderRadius: '20px'}}>
            <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '12px 20px'}}>
            <CardSection/>
            </div>
            <br />
            <button style={trialButtonStyle}>Pay Now</button>
          </div>
        </form>

      </center>
    );
  }
}

export default injectStripe(CheckoutForm);
