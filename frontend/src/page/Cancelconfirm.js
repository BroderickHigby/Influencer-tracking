import React, { Component } from 'react';

class Cancelconfirm extends Component {
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
          <h3> Your subscription has been cancelled!</h3>
          <br></br>
          <button onClick={this.handleClick}> Go to Home </button>
        </center>
      </div>
    );
  }
}

export default Cancelconfirm;
