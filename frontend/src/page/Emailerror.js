import React, { Component } from 'react';

class Emailerror extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    window.location = "./subscribe"
  }
  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <br></br>
        <center>
          <h3> ERROR: Please use the email your account is connected to!</h3>
          <br></br>
          <button onClick={this.handleClick}> Go back </button>
        </center>
      </div>
    );
  }
}

export default Emailerror;
