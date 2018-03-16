import React, { Component } from 'react';

import Content from '../layout/Content';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

import BigSearchBox from '../components/BigSearchBox';
import { updateCustomAttributes, getAttributes } from '../libs/awsLib';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";



class Home extends Component {
    async checkTrial() {
      var attributes = await getAttributes();

      var i =0;
      var trial = false;
      var daysLeft = 0;

      for( i = 0; i < attributes.length; i++){
        if(attributes[i].Name === "custom:subs_type"){
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
    }
    render() {
      this.checkTrial();

        return (
            <React.Fragment>
              <Content>
                <Filler />
                <MainContent>
                  <BigSearchBox />
                </MainContent>
                <Filler />
              </Content>
            </React.Fragment>
        );
    }
}

export default Home;
