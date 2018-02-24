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

    if (strUser === "Monthly") {
      axios.post('http://127.0.0.1:5000/charge_monthly', postData, axiosConfig)
      .then(function (response) {
        console.log("Charge confirmation sent to " + token.email + " //success");
        window.location = "./confirmation"

      }).catch(error => {
        console.log(error)
      });
    }

    else if (strUser === "Yearly") {
      axios.post('http://127.0.0.1:5000/charge_yearly', postData, axiosConfig)
      .then(function (response) {
        console.log("Charge confirmation sent to " + token.email + " //success");
        window.location = "./confirmation"


      }).catch(error => {
        console.log(error)
      });
    }

    else {
        console.log("No plan selected");
    }
  }


  render() {
    return (
      <div>
        <center>
        <br></br>
          <div>
            <h3><b>$299.00</b> for a monthly subscription</h3>
            <h3><strike>$3588.00</strike> <b>$3229.20 </b>for a yearly subscription</h3>
            <h4>10% for a yearly subscription!</h4>

            <select id="plans">
              <option value="" disabled selected>Select your option</option>
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <br></br>
            <br></br>
            <StripeCheckout
              token={this.onToken}
              stripeKey="pk_test_Jjys3Yuxu330uiclk4ViXeHM"
            />
          </div>
        </center>
      </div>
    );

  }
}

export default Subscribe;
