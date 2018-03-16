import React, { Component } from 'react';
import axios from 'axios';
import { updateCustomAttributes, getAttributes } from '../libs/awsLib';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";


const ButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

class Unsubscribe extends Component {
  constructor(props) {
    super(props);
  }

  async handleClick() {
    var attributes = await getAttributes();

    var i =0;
    var trial = false;

    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "custom:subs_type"){
        if(attributes[i].Value === "trial") {
          trial = true;
        }
      }
    }

    if (trial === false) {
        for( i = 0; i< attributes.length; i++){
          if(attributes[i].Name === "custom:subs_id"){
            break;
          }
        }
        /*
          Pull subscription_id from the cognito user pool to pass into postData
        */

        //Get the user's sub_id from the cognito user pool
        var postData = {
            subscription_id: attributes[i].Value,
        };

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*"
            }
        };

        //http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000
        //http://127.0.0.1:5000

        axios.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/cancel_subscription', postData, axiosConfig)
        .then(async function (response) {

          //Set value in cognito pool (with email) of subscribed to false
          //Revoke access to payed authenticated routes

          var lastDay = response.data.date;
          console.log("Cancelation:" +  lastDay);
          //window.location = "./cancelconfirm"


          /*
            Save the subscription_id to the the user in cognito with the
            email user_email. The subscription_id is used to cancel the subscription
            later on.
          */


          const attributeList= [
               new CognitoUserAttribute({
                 Name: 'custom:subs_id',
                 Value: ""
               }),
               new CognitoUserAttribute({
                 Name: 'custom:subs_type',
                 Value: "noTrial"
               }),
               new CognitoUserAttribute({
                 Name: 'custom:subs_active',
                 Value: "false"
               })
             ]


          await updateCustomAttributes(attributeList);

          window.location = "http://app.sapie.space/app/cancelconfirm"

        }).catch(error => {
          console.log(error)
        });
    }
    else {
      const attributeList= [
           new CognitoUserAttribute({
             Name: 'custom:subs_id',
             Value: ""
           }),
           new CognitoUserAttribute({
             Name: 'custom:subs_type',
             Value: "noTrial"
           }),
           new CognitoUserAttribute({
             Name: 'custom:subs_active',
             Value: "false"
           })
         ]

      await updateCustomAttributes(attributeList);
      window.location = "http://app.sapie.space/app/home"

    }

  }

  async getTrial() {
    var attributes = await getAttributes();

    var i =0;
    var trial = false;
    var daysLeft = 0;

    for( i = 0; i < attributes.length; i++){
      if(attributes[i].Name === "custom:subs_type"){
        if(attributes[i].Value === "trial") {
          return true;
        }
      }
    }
    return false;
  }

  async getTimeLeft() {
    var attributes = await getAttributes();

    var i =0;
    var trial = false;
    var daysLeft = 0;

    console.log("in time left");
    for( i = 0; i < attributes.length; i++){
      if(attributes[i].Name === "custom:subs_type"){
        if(attributes[i].Value === "trial") {
          console.log(trial);
          trial = true;
          console.log(trial);
          daysLeft = 30 - ((new Date().getTime() - parseInt(attributes[i].Value))/(1000 * 60 * 60 * 24));
        }
      }
    }
    return daysLeft;
  }

  render() {

    return (
      <div>
        <center>
          <h3> A cancellation will take immediate effect </h3>
          <br />
          <button onClick={this.handleClick} style={ButtonStyle}>Cancel Subscription</button>
        </center>
      </div>
    );

  }
}

export default Unsubscribe;
