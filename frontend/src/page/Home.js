import React, { Component } from 'react';

import Content from '../layout/Content';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

import BigSearchBox from '../components/BigSearchBox';
import TopSearches from '../components/TopSearches';
import { updateCustomAttributes, getAttributes } from '../libs/awsLib';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";

import sapielogo from "../logos/sapielogo90.png";



class Home extends Component {
    async checkTrial() {
      var attributes = await getAttributes();

      //FILL ARRAY WITH SUBSCRIPTION BYPASS emails_bypass
      //TODO @Brody

      var emails_bypass = ["nbavafa@gmail.com"];

      var i =0;
      var trial = false;
      var daysLeft = 0;
      var trialIndex = 0;

      for( i = 0; i < attributes.length; i++){

        if(attributes[i].Name === "custom:subs_type"){
          trialIndex = i;

          if(attributes[i].Value === "trial") {

            trial = true;
            daysLeft = 7 - ((new Date().getTime() - parseInt(attributes[i].Value))/(1000 * 60 * 60 * 24));

            if (daysLeft <= 0) {

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

            }
          }
        }
      }
      var k = 0;
      var j = 0;


      for(k = 0; k < attributes.length; k++) {

        if(attributes[k].Name === "email") {

          for (j = 0; j < emails_bypass.length; j++) {

            if (emails_bypass[j] === attributes[k].Value) {

              if (attributes[trialIndex].Value === "noTrial") {

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
                window.location = "http://app.sapie.space/app/home";
              }

            }

          }

        }

      }
    }

    render() {
      this.checkTrial();

        return (
            <React.Fragment>
              <Content>
                <Filler />
                <MainContent>
                  <center><img src={sapielogo} style={{height: '20%', width: '26%'}} /></center>

                  <div style={{textAlign: 'center', color: '#5F5F5F', fontSize: '1em', fontWeight: '700', textAlign: "center"}}>

                    <BigSearchBox />
                    <TopSearches />

                  </div>


                </MainContent>
                <Filler />
              </Content>
            </React.Fragment>
        );
    }
}

export default Home;
