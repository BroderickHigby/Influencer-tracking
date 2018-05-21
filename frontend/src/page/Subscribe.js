import React, { Component } from 'react';
import { updateCustomAttributes, getAttributes, getCurrentUser } from '../libs/awsLib';
import {  CognitoUserAttribute } from "amazon-cognito-identity-js";
import ReactPlayer from 'react-player'

import Popup from "reactjs-popup";

import {Elements} from 'react-stripe-elements';
import InjectedCheckoutForm from './components/CheckoutForm';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PromoArea from './components/PromoArea';


const tabStyle = {
  width: '15%',
  display: 'inline-block',
  fontSize: '1.1em',
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  margin: '10px',
  marginBottom: '-10px'
}

const submitButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '10px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em',
  width: '25%'
}


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

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promoCode: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePromoChange = this.handlePromoChange.bind(this);
  }

  handlePromoChange(e) {
    this.setState({ promoCode: e.target.value });
  }

  async grantAccess() {
    const attributeList= [
         new CognitoUserAttribute({
           Name: 'custom:subs_id',
           Value: "promo"
         }),
         new CognitoUserAttribute({
           Name: 'custom:subs_type',
           Value: "promo"
         }),
         new CognitoUserAttribute({
           Name: 'custom:subs_active',
           Value: "true"
         })
       ]
    await updateCustomAttributes(attributeList);
  }

  handleSubmit() {
    console.log("submitting");
    console.log(this.state.promoCode);
    if (this.state.promoCode.toLowerCase() === "goviral") {
      this.grantAccess();
    }
    window.location = "https://app.sapie.space/app/promo"
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

    if (allowtrial === true) {
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
              trigger={<button style={demoButtonStyle}>View Demo</button>}
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

              <br />
              <Tabs>
                <TabList>
                  <Tab style={tabStyle}> Pay Now</Tab>
                  <Tab style={tabStyle}>Access Code</Tab>
                  <Tab style={tabStyle}>Free Trial</Tab>
                </TabList>

                <TabPanel>
                  <div id="arrow" style={{display: 'inline-block', width: '10%', marginTop: '-55px', marginRight: '33.3%'}}>
                    <div className="strike-through" style={{border: "solid 1px rgb(0,0,0,.50)", borderRadius: '1px'}}></div>
                  </div>
                  <div id='monthly' style={{display : 'inline-block', width: '60%', borderRadius: '12px', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>
                      {
                        (getCurrentUser().username === "bob") ? (
                          <div>
                          <h1>Monthly Subscription</h1>
                          <br/>
                          <h2><b>$1800.00</b><br></br> per month</h2>
                          <h4>The Monthly Plan</h4>
                          </div>
                        ) : (
                          <div>
                          <h1>Yearly Subscription</h1>
                          <br/>
                          <h2><b>$99.00</b><br></br> per year</h2>
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
                </TabPanel>

                <TabPanel>
                <div id="arrow" style={{display: 'inline-block', width: '10%', marginTop: '-55px'}}>
                  <div className="strike-through" style={{border: "solid 1px rgb(0,0,0,.50)", borderRadius: '1px'}}></div>
                </div>
                <div id='monthly' style={{width: '60%', borderRadius: '12px', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>

                <h3>Enter an Access Code</h3>
                <br/>
                <form onSubmit>
                <PromoArea
                  rows={1}
                  resize={false}
                  content={this.state.promoCode}
                  name={'access code'}
                  controlFunc={this.handlePromoChange}
                  placeholder={'code'} />
                  <br />
                </form>
                <button onClick={this.handleSubmit} style={submitButtonStyle}>Get Access</button>

                </div>
                </TabPanel>

                <TabPanel>
                <div id="arrow" style={{display: 'inline-block', width: '10%', marginTop: '-55px', marginLeft: '33.3%'}}>
                  <div className="strike-through" style={{border: "solid 1px rgb(0,0,0,.50)", borderRadius: '1px'}}></div>
                </div>
                <div id='monthly' style={{display : 'inline-block', width: '60%', borderRadius: '12px', backgroundColor: "#f9f9fa", padding: '30px', margin: '15px',  marginLeft: '40px'}}>
                  <h3>Start a free 7 day trial </h3><br />
                  <button onClick={this.handleClick} style={trialButtonStyle}>Begin Trial</button>
                </div>
                </TabPanel>
              </Tabs>


          </div>
          </div>

          <br />
          {/*
          <Popup
            trigger={<button style={trialButtonStyle}>Have a Promo code?</button>}
            position="right center"
            modal
            closeOnDocumentClick
          >
          <div style={{minWidth: '100px'}}>
          <br />
          </div>

          </Popup>
          <br />
          */}


        </center>
      </div>
    );

  }
}

export default Subscribe;
