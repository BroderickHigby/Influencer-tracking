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
import logo from "../halfLogo.png";


const submitButtonStyle = {
  backgroundColor: '#711AAC',
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
    <div id='webpage' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px'}}>

      <div id='logoSide' style={{display : 'inline-block', width: '50%', backgroundColor: "#711AAC80", float: 'top', padding: '0px'}}>
        <br></br><br></br>
        <br></br><br></br>

        <img src={logo} width="80%" height="80%" />

        <br></br><br></br>
        <br></br><br></br>


      </div>

      <div id="form" style={{display : 'inline-block', width: '50%', float: 'left', height: '50%', padding: '0px', textAlign: 'left'}}>
      <center><h3><b>Login</b></h3></center>
      <br></br>

        <div className="text-center">
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId= "userId" bsSize= "large" style={{textAlign: 'left'}}>
              <ControlLabel>Username/Email</ControlLabel>
              <FormControl
                autoFocus
                type="userId"
                value={this.state.userId}
                placeholder="user"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId= "password" bsSize= "large" style={{textAlign: 'left'}}>
              <ControlLabel>Password</ControlLabel>
              <p style={{color: 'rgba(0,0,0,.5)', fontSize: '.9em'}}>Password must be 8 characters long, with one special character, and one number *</p>
              <FormControl
                type="password"
                value={this.state.password}
                placeholder="password"
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
          <br/>
          <Button onClick = {()=> this.setState({knowsPassword: false})}>Forgot Password?</Button>
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
