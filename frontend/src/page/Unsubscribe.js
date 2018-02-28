import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';


class Unsubscribe extends Component {
  constructor(props) {
    super(props);
  }

  onClick() {


    /*
      Pull subscription_id from the cognito user pool to pass into postData
    */

    //Get the user's sub_id from the cognito user pool
    var postData = {
        //subscription_id: cognito field that holds subscription,
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
    .then(function (response) {

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

      window.location = "./cancelconfirm"

    }).catch(error => {
      console.log(error)
    });


  }


  render() {
    return (
      <div>
        <center>
          <h3> A cancellation will take immediate effect </h3>
          <br></br>
          <button onClick={this.handleClick}>Cancel Subscription</button>
        </center>
      </div>
    );

  }
}

export default Unsubscribe;
