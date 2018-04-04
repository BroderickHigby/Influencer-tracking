import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "./components/LoaderButton";
import config from "../config";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";
import {confirmPassword, forgotPassword} from "../libs/awsLib";
import logo from "../logos/halfLogo.png";
import { Link } from "react-router-dom";

import sapielogo from "../logos/sapielogo.png";
import searchIcon from "../icons/search.svg";
import connectionsIcon from "../icons/connections.svg";
import multipleIcon from "../icons/multiple.svg";


const submitButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      userId: "",
      password: "",
      newPassword:"",
      knowsPassword: true,
      verificationCode: "",
      userGiven: false,
      email: "",
      cognitoUser: null
    };
  }

  validateForm() {
    return this.state.userId.length > 0 && this.state.password.length > 0;
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
      await this.login(this.state.userId, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.userUpdate(this.state.cognitoUser);
      await this.props.userJustLoggedIn();
      this.props.history.push("/app/home");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleSubmitForgot = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try{
      confirmPassword(this.state.email, this.state.verificationCode, this.state.newPassword);
      this.setState({ isLoading: false });
      alert("Password successfully changed!");
    }catch(e){
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleSubmitEmail = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.setState({ userGiven: true});
    console.log(this.state.email);
    try{
      forgotPassword(this.state.email);
      this.setState({ isLoading: false });
    }catch(e){
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  login(userId, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    this.state.cognitoUser = new CognitoUser({ Username: userId, Pool: userPool });
    const authenticationData = { Username: userId, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
    this.state.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(),
      onFailure: err => reject(err)
    })
  );
}

renderLogin(){
  return(
    <div id='webpage' style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '0px', backgroundColor: 'white', position: 'absolute', top: '0', overflowX: 'hidden'}}>


    <div class="row" style={{height: '100%'}}>
    <div class="col-md-6" style={{backgroundColor: 'white', height: '100%'}}>
    <div style={{width: '320px', margin: '100px auto 25px auto'}}>
    <div style={{fontSize:'1.688em', fontWeight: '700', marginTop: '25px'}}>Log in to Sapie</div>
    </div>

    <form onSubmit={this.handleSubmit}>
    <FormGroup controlId= "userId" bsSize= "large" style={{textAlign: 'left'}}>
    <FormControl
    autoFocus
    type="userId"
    value={this.state.userId}
    placeholder="Username"
    onChange={this.handleChange}
    />
    </FormGroup>
    <FormGroup controlId= "password" bsSize= "large" style={{textAlign: 'left'}}>
    <FormControl
    type="password"
    value={this.state.password}
    placeholder="Password"
    onChange={this.handleChange}
    />
    </FormGroup>
    <LoaderButton
    block
    bsSize="large"
    disabled={!this.validateForm()}
    type="submit"
    isLoading={this.state.isLoading}
    style={submitButtonStyle}
    text="Login"
    loadingText="Logging in…"
    />
    </form>
    <div style={{width: '320px', margin: '10px auto 0px auto'}}>
    <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '25px'}}>New to Sapie? <Link to ={'/app/signup'}>Make an account</Link></div>

    <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '5px'}}><a onClick = {()=> this.setState({knowsPassword: false})}>Forgot password?</a></div>
    </div>



    </div>

    <div class="col-md-6" style={{backgroundColor: '#66b2b2', height: '100%', overflow: 'hidden'}}>
    <div style={{position: 'absolute', textAlign: 'left', width: '60%', color: 'white', fontSize: '1.325em', zIndex: '2', top: '30%', left: '20%', fontWeight: '700'}}>
    <div><img src={searchIcon} style={{height: '20px', marginRight: '10px'}} />Search for influencers.</div>

    <div style={{marginTop: '48px', marginBottom: '48px'}}><img src={multipleIcon} style={{height: '20px', marginRight: '10px'}} />Find real influencers. </div>
    <div><img src={connectionsIcon} style={{height: '20px', marginRight: '10px'}} />Make connections.</div>
    </div>
    <img src={sapielogo} style={{height: '100%', position: 'absolute', left: '50%', zIndex: '1'}} />
    </div>
    </div>


    </div>
  )
}

renderForgot(){
  return(
    <div className="Forgot">
    {!this.state.userGiven
      ?<form onSubmit={this.handleSubmitEmail}>
      <FormGroup controlId= "email" bsSize= "large">
      <ControlLabel>Email</ControlLabel>
      <FormControl
      autoFocus
      type="text"
      value={this.state.email}
      placeholder="account email"
      onChange={this.handleChange}
      />
      </FormGroup>
      <LoaderButton
      block
      bsSize="large"
      disabled={false}
      type="submit"
      isLoading={this.state.isLoading}
      text="Send Verification Code"
      loadingText="Sending code..."
      />
      </form>
      :[<form key={1} onSubmit={this.handleSubmitForgot}>
        <FormGroup controlId= "verificationCode" bsSize= "large">
        <ControlLabel>Verification Code</ControlLabel>
        <FormControl
        autoFocus
        type="text"
        value={this.state.verificationCode}
        placeholder="input verification code"
        onChange={this.handleChange}
        />
        </FormGroup>
        <FormGroup controlId= "newPassword" bsSize= "large">
        <ControlLabel>New Password</ControlLabel>
        <FormControl
        autoFocus
        type="text"
        value={this.state.newPassword}
        placeholder="input desired password"
        onChange={this.handleChange}
        />
        </FormGroup>
        <LoaderButton
        block
        bsSize="large"
        disabled={false}
        type="submit"
        isLoading={this.state.isLoading}
        text="Verify"
        loadingText="Verifying..."
        />
        </form>
      ]}
      </div>
    )
  }

  render() {
    return (
      <div className="Signup" style={{padding: '0px 0px'}}>
      {this.state.knowsPassword
        ? this.renderLogin()
        : this.renderForgot()}
        </div>
      );
    }

  }
