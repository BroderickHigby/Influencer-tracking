import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Link } from "react-router-dom";
import LoaderButton from "./components/LoaderButton";
import "./Signup.css";
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import config from "../config";
import Flexbox from 'flexbox-react';

import logo from "../halfLogo.png";
import Login from "./Login.js";

import sapielogo from "../sapielogo.png";
import searchIcon from "../search.svg";
import connectionsIcon from "../connections.svg";
import multipleIcon from "../multiple.svg";


const submitButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

const iconStyle = {
  height: '10px',
  marginRight: '10px'
}


export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoading2: false,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.username.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const attributeList= [
        new CognitoUserAttribute({
          Name: 'email',
          Value: this.state.email
        })
      ]

      const newUser = await this.signup(this.state.username, this.state.password, attributeList);
      this.setState({
        newUser: newUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);
      await this.authenticate(
        this.state.newUser,
        this.state.username,
        this.state.password
      );
      this.props.userUpdate(this.state.newUser);
      this.props.userHasAuthenticated(true);
      this.props.userHasSubscribed(false);

      this.props.history.push("/app/subscribe");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleClick = async event => {
    event.preventDefault();

    this.setState({ isLoading2: true });

    try {
      await this.resendConfirmCode();
      this.setState({ isLoading2: false });
    }

    catch (e) {
      alert(e);
      this.setState({ isLoading2: false });
    }
  }


  signup(username, password, attributeList) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return new Promise((resolve, reject) =>
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.user);
    })
  );
}

confirm(user, confirmationCode) {
  return new Promise((resolve, reject) =>
  user.confirmRegistration(confirmationCode, true, function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  })
);
}

authenticate(user, username, password) {
  const authenticationData = {
    Username: username,
    Password: password
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
  user.authenticateUser(authenticationDetails, {
    onSuccess: result => resolve(),
    onFailure: err => reject(err)
  })
);
}

resendConfirmCode() {
  return new Promise((resolve, reject) =>
  this.state.newUser.resendConfirmationCode(function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  })
);
}

renderConfirmationForm() {
  return (
    <form onSubmit={this.handleConfirmationSubmit}>
    <FormGroup controlId="confirmationCode" bsSize="large">
    <ControlLabel>Confirmation Code</ControlLabel>
    <FormControl
    autoFocus
    type="tel"
    value={this.state.confirmationCode}
    onChange={this.handleChange}
    />
    <HelpBlock>Please check your email for the code.</HelpBlock>
    </FormGroup>
    <LoaderButton
    block
    bsSize="large"
    disabled={!this.validateConfirmationForm()}
    type="submit"
    isLoading={this.state.isLoading}
    text="Verify"
    loadingText="Verifying…"
    />
    <LoaderButton onClick={this.handleClick}
    block
    bsSize="large"
    disabled={false}
    type="submit"
    isLoading={this.state.isLoading2}
    text="Resend Code"
    loadingText="Resending..."
    />
    </form>
  );
}

renderForm() {
  return (

    <div id='webpage' style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '0px', backgroundColor: 'white', position: 'absolute', top: '0', overflowX: 'hidden'}}>


    <div class="row" style={{height: '100%'}}>
    <div class="col-md-6" style={{backgroundColor: 'white', height: '100%'}}>
    <div style={{width: '320px', margin: '100px auto 25px auto'}}>
    <div style={{fontSize: '1.688em', fontWeight: '700', lineHeight: '95%'}}>Start finding influencers right now</div>
    <div style={{fontSize:'1.125em', fontWeight: '700', marginTop: '25px'}}>Join Sapie Today!</div>
    <video controls="controls" width="800" height="600"
       name="Video Name" src="sapie_good.mov"></video>
    </div>

    <form onSubmit={this.handleSubmit} style={{}}>
    <FormGroup controlId="username" bsSize="large">
    <FormControl
    autoFocus
    type="username"
    value={this.state.username}
    onChange={this.handleChange}
    placeholder="Username"
    />
    </FormGroup>
    <FormGroup controlId="email" bsSize="large">
    <FormControl
    autoFocus
    type="email"
    value={this.state.email}
    onChange={this.handleChange}
    placeholder="Email"
    />
    </FormGroup>
    <FormGroup controlId="password" bsSize="large">
    <FormControl
    value={this.state.password}
    onChange={this.handleChange}
    type="password"
    placeholder="Password"
    />
    </FormGroup>
    <FormGroup controlId="confirmPassword" bsSize="large">
    <FormControl
    value={this.state.confirmPassword}
    onChange={this.handleChange}
    type="password"
    placeholder= "Confirm password"
    />
    </FormGroup>
    <p style={{color: 'rgba(0,0,0,.5)', fontSize: '.9em', marginBottom: '30px'}}>Password must be 8 characters long, with one special character, and one number *</p>
    <LoaderButton
    block
    bsSize="large"
    style={submitButtonStyle}
    disabled={!this.validateForm()}
    type="submit"
    isLoading={this.state.isLoading}
    text="Get Started"
    loadingText="Signing up…"
    />
    </form>
    <div style={{width: '320px', margin: '10px auto 0px auto'}}>
    <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '25px'}}>Already a Member? <Link to ={'/app/login'}>Sign in</Link></div>
    </div>



    </div>

    <div class="col-md-6" style={{backgroundColor: '#a269c8', height: '100%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', textAlign: 'left', width: '60%', color: 'white', fontSize: '1.325em', zIndex: '2', top: '30%', left: '20%', fontWeight: '700'}}>
    <div><img src={searchIcon} style={{height: '20px', marginRight: '10px'}} />Search for influencers.</div>

    <div style={{marginTop: '48px', marginBottom: '48px'}}><img src={multipleIcon} style={{height: '20px', marginRight: '10px'}} />Find real influencers. </div>
    <div><img src={connectionsIcon} style={{height: '20px', marginRight: '10px'}} />Make connections.</div>
    </div>
    <img src={sapielogo} style={{height: '100%', position: 'absolute', left: '50%', zIndex: '1'}} />
    </div>
    </div>


    </div>
  );
}

render() {
  return (
    <div className="Signup" style={{padding: '0px'}}>
    {this.state.newUser === null
      ? this.renderForm()
      : this.renderConfirmationForm()}
      </div>
    );
  }
}
