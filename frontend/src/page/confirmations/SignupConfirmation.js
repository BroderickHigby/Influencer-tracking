import React, { Component } from 'react';
import { getCurrentUser , getAttributes } from '../../libs/awsLib';

import sapielogo from "../../logos/sapielogo90.png";

const trialButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}


class SignupConfirmation extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.location = "./home"
  }



  // async getEmail() {
  //   var i = 0;
  //   var attributes = await getAttributes();
  //   var emailUser = "";
  //
  //   for( i = 0; i< attributes.length; i++){
  //     if(attributes[i].Name === "email") {
  //       emailUser = attributes[i].Value;
  //     }
  //   }
  // }

  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        <center>
          <a href={"./app/home"} target="_blank">
              <img src={sapielogo} style={{height: '15%', width: '15%', paddingBottom: '20px'}} />
          </a>

          <h1> <b> Welcome, {getCurrentUser().username}! </b> </h1>
          <br />

          <h3> Our CEO, Jack, will personally contact you <br /> to learn about your specific needs </h3>
          <br />


          <button onClick={this.handleClick} style={trialButtonStyle}> Go to Home </button>

        </center>
      </div>
    );
  }
}

export default SignupConfirmation;
