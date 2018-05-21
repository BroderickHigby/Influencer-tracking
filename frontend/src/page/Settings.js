import React, { Component } from 'react';
import {CognitoUser} from "amazon-cognito-identity-js";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import {Link} from 'react-router-dom';
import { getCurrentUser, changePassword } from '../libs/awsLib.js';

import sapielogo from "../logos/sapielogo90.png";

import LoaderButton from "./components/LoaderButton";

var lightColor = '#66b2b2';
var darkColor = '#008080';
var lightGray = '#E8E8E8';

const rootStyle = {
    textAlign: 'center'
}

const profileStyle = {
  fontSize: '1.1em'
}

const formStyle = {
  margin: '0 auto',
  maxWidth: '320px'
}

const searchesStyle = {
  fontWeight: '400',
  fontSize: '1em',
  color: 'black',
  backgroundColor: lightGray,
  borderRadius: '2em',
  padding: '5px 10px',
  border: 'none',
  display: 'inline-block',
  marginTop: '1px',
  maringBottom: '7px',
  marginLeft: '5px',
  maringRight: '5px',
}

const buttonStyle = {
  //backgroundColor: '#66b2b2',
  borderRadius: '4px',
  color: 'black',
  padding: '5px 10px',
  border: '1',
  fontSize: '1em'
}

export default class Settings extends Component{
  constructor(props){
    super(props);


    this.state = {
      isLoading: false,
      oldPassword: '',
      newPassword: '',
      change: false
    };
  }

  validateForm() {
    return this.state.oldPassword.length > 0 && this.state.newPassword.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClick() {
    window.location = "/app/unsubscribe";
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await changePassword(this.props.user, this.state.oldPassword,this.state.newPassword);
      this.setState({ isLoading: false });
      alert("Password successfully changed!");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return(
      <div className= "Settings">
        <br />
        <div>
          <div style={{width: '30%', marginLeft: '10px', padding: '30px', paddingLeft: '60px', paddingRight: '5px', display:'inline-block', justifyContent:'center'}}>
            <div>
              <center>
              <a href={"./app/home"} target="_blank">
                  <img src={sapielogo} style={{height: '50%', width: '50%', paddingBottom: '20px'}} />
              </a>
              <div style={{border: '1px solid #E8E8E8', padding: '20px', borderRadius: '20px', marginLeft: '15px', marginRight: '15px'}}>

                    {
                      this.props.subscribed ? (
                        <div>
                          <button onClick={this.handleClick} style={buttonStyle}> Click to unsubscribe </button>
                        </div>
                      ) : (
                        <Link to= "/app/subscribe">Click to subscribe </Link>
                      )
                    }
                    <br />
                    {
                      !this.state.change
                        ?<Button onClick = {()=> this.setState({change: true})}>Change Password</Button>
                        :[<form key={1} onSubmit={this.handleSubmit} style= {formStyle}>
                          <FormGroup controlId= "oldPassword" bsSize= "large">
                            <ControlLabel>Current password</ControlLabel>
                            <FormControl
                              autoFocus
                              type="password"
                              value={this.state.oldPassword}
                              placeholder="current password"
                              onChange={this.handleChange}
                            />
                        </FormGroup>
                          <FormGroup controlId= "newPassword" bsSize= "large">
                            <ControlLabel>New password</ControlLabel>
                            <FormControl
                              autoFocus
                              type="password"
                              value={this.state.newPassword}
                              placeholder="A-Z + a-z + 0-9 + !@#$%^"
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                          <LoaderButton
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Change Password"
                            loadingText="Changing..."
                          />
                        </form>
                    ]
                  }
              </div>
              </center>
            </div>
          </div>

          <div style={{display: 'inline-block', width: '60%', justifyContent:'center', verticalAlign: 'top'}}>
            <br />
            <div> <h2>{getCurrentUser().username}</h2> </div>

            <div style={{border: '1px solid #E8E8E8', padding: '20px', borderRadius: '20px'}}>
              <p style={profileStyle}> Subscribed: {this.props.subscribed} </p> <br />
              <p style={profileStyle}> Recent Searches: </p>
                <p style={searchesStyle}>soccer</p>
                <p style={searchesStyle}>MMA</p>
                <p style={searchesStyle}>Vegan</p>
              <br /> <br /> <p style={profileStyle}>Digital Campaigns Run: </p>
                <p style={searchesStyle}>Industry: _________</p>
                <p style={searchesStyle}>Influencers: ______, _______, _______</p>
              <br /> <br /> <p style={profileStyle}>Physical Campaigns Run: </p>
                <p style={searchesStyle}>Location: _________</p>


            </div>

          </div>



          </div>

      </div>
    )
  }
}
