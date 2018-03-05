import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
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


const submitButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
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
      this.props.history.push("/app/home");
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
      <div id='webpage' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

        <div id='logoSide' style={{display : 'inline-block', width: '50%', backgroundColor: "#711AAC80", float: 'top', padding: '0px'}}>
          <br></br><br></br>
          <br></br><br></br>

          <img src={logo} width="80%" height="80%" />

          <br></br><br></br>
          <br></br><br></br>


        </div>

        <div id="form" style={{display : 'inline-block', width: '50%', float: 'middle', height: '50%', padding: '0px'}}>
          <center><h2><b> Join Sapie Today!</b></h2></center>

          <br></br> <br></br>
          <form onSubmit={this.handleSubmit} style={{}}>
            <FormGroup controlId="username" bsSize="large">
              <ControlLabel>Username</ControlLabel>
              <FormControl
                autoFocus
                type="username"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="username"
              />
            </FormGroup>
            <FormGroup controlId="email" bsSize="large">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="test@example.com"
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel>
              <FormControl
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                placeholder="A-Z + a-z + 0-9 + !@#$%^"
              />
            </FormGroup>
            <FormGroup controlId="confirmPassword" bsSize="large">
              <ControlLabel>Confirm Password</ControlLabel>
              <FormControl
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                type="password"
                placeholder= "confirm password"
              />
            </FormGroup>
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
          <br></br><br></br>
          <center><h3><b> Already a Member?</b></h3>
          <a href={'/app/login'} target="_blank">Sign in</a>
          </center>

        </div>

      </div>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
