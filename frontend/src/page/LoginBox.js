import React, { Component } from "react";

import logo from "../logos/halfLogo.png";
import Login from "./Login.js";


export default class LoginBox extends Component {
  constructor(props) {
    super(props);

  };


render() {
  return (
    <div id='webpage' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

      <div id='logoSide' style={{display : 'inline-block', width: '50%', backgroundColor: "#711AAC80", float: 'top', padding: '0px'}}>
        <br></br><br></br>
        <br></br><br></br>

        <img src={logo} width="80%" height="80%" />

        <br></br><br></br>
        <br></br><br></br>


      </div>

      <div id="form" style={{display : 'inline-block', width: '50%', float: 'middle', height: '50%', padding: '0px'}}>
        <Login />
      </div>

    </div>
    );
  }

}
