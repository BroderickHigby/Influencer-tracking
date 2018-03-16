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


const trialButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

const dropdownStyle = {
  backgroundColor: '#787878',
  borderRadius: '4px',
  color: 'white',
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

      var e = document.getElementById("plans");
      var strUser = e.options[e.selectedIndex].value;
      console.log("Plan " + strUser);


      //If user email entered is the same as currently logged in
      //Else throw error and redo page
      var route = "";
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
            Value: strUser
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
            <br></br>

            <div id='yearly' style={{display : 'inline-block', width: '42%', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginRight: '40px'}}>
            <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse"} aria-expanded="false" aria-controls={"collapse"} style={{color: '#711aac'}}>
            View Demo
            </a>
              <div id={"collapse"} class="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading"} style={{backgroundColor: '#f9f9fa'}}>
                <div class="panel-body">
                  <div class="row">
                    <div class="col-sm-2" style={{height: '100%', display: 'table-cell'}}>
                    <br/>
                      </div>
                        <div clas="col-sm-10">
                        <ReactPlayer url='https://youtu.be/PKdd6sQuzb4' playing />
                        </div>
                      </div>
                  </div>
                </div>
              </div>

            <div id='webpage' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

              <div id='monthly' style={{display : 'inline-block', width: '30%', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>
                  <h3>Monthly Subscription</h3>
                  <h2><b>$299.00</b><br></br> per month</h2>
                  <h4>The Basic Plan</h4>

              </div>

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
            <br></br>
            <StripeCheckout
              token={this.onToken}
              stripeKey="pk_live_AEuriPJROzqDhDu5Y73oTUR4"
            />
          </div>
          <br />
          <h3>Or... Start a free 7day trial </h3><br />
          <button onClick={this.handleClick} style={trialButtonStyle}>Begin Trial</button>

        </center>
      </div>
    );

  }
}

export default Subscribe;
