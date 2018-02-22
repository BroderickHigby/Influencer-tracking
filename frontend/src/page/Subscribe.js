import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';



class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.onToken = this.onToken.bind(this);
  }

  onToken(token) {
    //Search userpool database for valid user Email
    var postData = {
        stripeToken: token.id,
        email: token.email
    };

    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*"
        }
    };

    axios.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/charge', postData, axiosConfig)
    .then(function (response) {
      console.log("Charge confirmation sent to " + token.email + " ://success");
    }).catch(error => {
      console.log(error)
    });

  }

  render() {
    return (
      <div>
        <center>
        <br></br>
          <h3>$299.00 for a monthly subscription!</h3>
        <br></br>

          <StripeCheckout
            token={this.onToken}
            stripeKey="pk_test_Jjys3Yuxu330uiclk4ViXeHM"
          />

        </center>
      </div>
    );

  }
}

export default Subscribe;
