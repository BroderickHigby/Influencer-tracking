import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "./components/LoaderButton";
import "./Login.css";
import config from "../config";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      userId: "",
      password: ""
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
      this.props.userDetails(this.state.userId);
      this.props.history.push("/app/home");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  login(userId, password) {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  const user = new CognitoUser({ Username: userId, Pool: userPool });
  const authenticationData = { Username: userId, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(),
      onFailure: err => reject(err)
    })
  );
}

  render(){
    return(
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId= "userId" bsSize= "large">
            <ControlLabel>Username/Email</ControlLabel>
              <FormControl
                autoFocus
                type="userId"
                value={this.state.userId}
                placeholder="user"
                onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId= "password" bsSize= "large">
              <ControlLabel>Password</ControlLabel>
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
              text="Login"
              loadingText="Logging in…"
            />
          </form>
        </div>
    )
  }

}
