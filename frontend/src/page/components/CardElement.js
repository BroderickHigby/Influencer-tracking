import React from 'react';
import {CardElement} from 'react-stripe-elements';

var style = {
  base: {
    color: '#303238',
    backgroundColor:'lightgrey',
    fontSize: '25px',
    fontFamily: '"Encode Sans Expanded", sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#CFD7DF',
    },
  },
  invalid: {
    backgroundColor:'lightgrey',
    color: '#e5424d',
    ':focus': {
      color: '#303238',
    },
  },
};

class CardSection extends React.Component {
  render() {
    return (

      <CardElement style={style} />
    );
  }
};

export default CardSection;
