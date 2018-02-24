import React, { Component } from 'react';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.location = "./home"
  }
  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        <center>
          <h3> Thank you for your subscription!</h3>
          <br></br>
          <button onClick={this.handleClick}> Go to Home </button>
        </center>
      </div>
    );
  }
}

export default Confirmation;
