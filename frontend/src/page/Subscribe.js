import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.onToken = this.onToken.bind(this);
  }

  onToken(token) {
    //Search userpool database for valid user Email

    console.log('onToken', token.email);
    console.log('id', token.id);
    /*
    fetch('stripe',
      {
        method: 'POST',
        body: token.id,
      }
    )
    */
  }

  render() {
    return (
      <div>
        <center>
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
