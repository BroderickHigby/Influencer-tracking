import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { updateCustomAttributes, getAttributes, getCurrentUser } from '../libs/awsLib';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import ReactPlayer from 'react-player'

import Popup from "reactjs-popup";

import {Elements} from 'react-stripe-elements';
import InjectedCheckoutForm from './components/CheckoutForm';




const demoButtonStyle = {
  backgroundColor: '#FFFFFF',
  color:'#4379b3',
  borderRadius: '20px',
  border: '0',
  paddingLeft: '3px'
}

const trialButtonStyle = {
  backgroundColor: '#66b2b2',
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
      window.location = "https://app.sapie.space/app/signupconfirm"
    }
    else {
      window.location = "https://app.sapie.space/app/trialerror"
    }
  }


  render() {
    return (
      <div>
        <center>
        <br></br>
            <div>
            <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '25px'}}>Watch Sapie in Action:

            <Popup
              trigger={<button style={demoButtonStyle}  View Demo</button>}
              position="right center"
              modal
              closeOnDocumentClick
            >
            <div style={{minWidth: '400px'}}>
                  <div>
                    <ReactPlayer url='https://youtu.be/Rf0L7LYVhBM' playing />
                  </div>
                </div>
            </Popup>
              </div>

            <div id='webpage' style={{width: '100%', height: '100%', display: 'fixed', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

              <div id='monthly' style={{display : 'inline-block', width: '60%', borderRadius: '12px', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>
                  <h3>Monthly Subscription</h3>
                  {
                    (getCurrentUser().username === "bob") ? (
                      <div>
                      <h2><b>$450.00</b><br></br> per month</h2>
                      <h4>The Monthly Plan</h4>
                      </div>

                    ) : (
                      <div>
                      <h2><b>$99.00</b><br></br> per year</h2>
                      <h4>The Yearly Plan</h4>
                      </div>
                    )
                  }

          <br />
          {/*
          <StripeCheckout
            token={this.onToken}
            stripeKey="pk_live_AEuriPJROzqDhDu5Y73oTUR4"
          />
          */ }

          <Elements>
            <InjectedCheckoutForm />
          </Elements>

          </div>
          </div>
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
