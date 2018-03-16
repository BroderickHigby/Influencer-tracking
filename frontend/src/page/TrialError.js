import React, { Component } from 'react';


const trialButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

class TrialError extends Component {
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
          <h3> ERROR: This user has already maxed out their trial period</h3>
          <br></br>
          <button onClick={this.handleClick} style={trialButtonStyle}> Go back </button>
        </center>
      </div>
    );
  }
}

export default TrialError;
