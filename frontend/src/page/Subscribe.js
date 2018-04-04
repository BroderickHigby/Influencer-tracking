import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { updateCustomAttributes, getAttributes } from '../libs/awsLib';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import ReactPlayer from 'react-player'
import Popup from "reactjs-popup";


const demoButtonStyle = {
  backgroundColor: '#FFFFFF',
  color:'#4379b3',
  borderRadius: '20px',
  border: '0',
  paddingLeft: '3px'
}

const trialButtonStyle = {
  backgroundColor: 'rgb(82, 145, 199)',
  borderRadius: '5px',
  color: 'white',
  padding: '10px 10px',
  border: '1px',
  fontSize: '1em'
}

const dropdownStyle = {
  borderRadius: '4px',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

//pk_test_Jjys3Yuxu330uiclk4ViXeHM
//pk_live_AEuriPJROzqDhDu5Y73oTUR4

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.onToken = this.onToken.bind(this);
  }

  async handleClick() {
    var attributes = await getAttributes();

    var i =0;
    var allowtrial = true;

    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "custom:subs_type"){
        if(attributes[i].Value === "noTrial") {
          console.log(attributes[i].Value);
          allowtrial = false;
        }
      }
    }
    console.log(allowtrial);

    if (allowtrial == true) {
      const attributeList= [
        new CognitoUserAttribute({
          Name: 'custom:subs_id',
          Value: new Date().getTime().toString()

        }),
        new CognitoUserAttribute({
          Name: 'custom:subs_type',
          Value: "trial"
        }),
        new CognitoUserAttribute({
          Name: 'custom:subs_active',
          Value: "true"
        }),
      ]

      await updateCustomAttributes(attributeList);
      attributes = await getAttributes();

      for( i = 0; i< attributes.length; i++){
        if(attributes[i].Name === "custom:subs_id"){
          console.log(attributes[i].Value);
          console.log(attributes[i].Value/(1000 * 60 * 60 * 24 * 30.25 * 12))
        }
      }
      window.location = "http://app.sapie.space/app/trialconfirmation"
    }
    else {
      window.location = "http://app.sapie.space/app/trialerror"
    }
  }

  async onToken(token) {
    var i =0;
    var attributes = await getAttributes();
    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "email"){
        break;
      }
    }
    //Check to see if current user email is the same as inputed email

    if (attributes[i].Value !== token.email) {
      window.location = "./emailerror"
    }

    else {

      var postData = {
          stripeToken: token.id,
          stripeEmail: token.email,
      };

      let axiosConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*"
          }
      };

      //http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000
      //http://127.0.0.1:5000

      /* Add again when using dropdown menu

      var e = document.getElementById("plans");
      var strUser = e.options[e.selectedIndex].value;
      console.log("Plan " + strUser);

      */


      //If user email entered is the same as currently logged in
      //Else throw error and redo page
      var route = "";
      route = 'http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/charge_monthly';
      //remove when using dropdown menu

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
        console.log("Charge confirmation sent to " + token.email + " //success");

        var subs = response.data.subscription;
        var subscription_id = subs.id;
        var user_email = token.email;

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

        window.location = "http://app.sapie.space/app/confirmation"

      }).catch(error => {
        console.log(error)
      });

    }
  }


  render() {
    return (
      <div>
        <center>
        <br></br>
            <div>
            <h5>Please use the same email you signed up with</h5>
            <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '25px'}}>Watch Sapie in Action:

            <Popup trigger={<button style={demoButtonStyle}> View Demo</button>} position="bottom right">
                  <div>
                    <ReactPlayer url='https://youtu.be/Rf0L7LYVhBM' playing />
                  </div>
            </Popup>
              </div>

            <div id='webpage' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

              <div id='monthly' style={{display : 'inline-block', width: '30%', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>
                  <h3>Monthly Subscription</h3>
                  <h2><b>$100.00</b><br></br> per month</h2>
                  <h4>The Monthly Plan</h4>

              </div>
            </div> {/* delete when adding more plans */}

              {/*
              <div id='early' style={{display : 'inline-block', width: '40%', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px'}}>
                  <h3> <i>Special</i> <br></br> Early Access Plan</h3>
                  <h2><strike>$299.00</strike><b> $149.00</b><br></br> per month</h2>
                  <h4> Limited Time Only!</h4>

              </div>

              <div id='yearly' style={{display : 'inline-block', width: '30%', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginRight: '40px'}}>
                <h3>Yearly Subscription</h3>
                <h2><strike>$3588.00</strike> <b>$3229.20 </b><br></br> per year</h2>
                <h4>10% off for a yearly subscription!</h4>
              </div>
            </div>



            <select id="plans" style={dropdownStyle}>
              <option value="" disabled selected hidden >Select your Plan</option>
              <option value="Early">Early Access</option>
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <br></br>

            */}

            <br></br>
            <StripeCheckout
              token={this.onToken}
              stripeKey="pk_live_AEuriPJROzqDhDu5Y73oTUR4"
            />
          </div>
          <br />
          <h3>Or... Start a free 7 day trial </h3><br />
          <button onClick={this.handleClick} style={trialButtonStyle}>Begin Trial</button>

        </center>
      </div>
    );

  }
}

export default Subscribe;
