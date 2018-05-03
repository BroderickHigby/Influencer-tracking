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

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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

    {
    window.mobilecheck() ? ( "" ) : (
    <div class="col-md-6" style={{backgroundColor: '#66b2b2', height: '100%', overflow: 'hidden'}}>
      <div style={{position: 'absolute', textAlign: 'left', width: '60%', color: 'white', fontSize: '1.325em', zIndex: '2', top: '30%', left: '20%', fontWeight: '700'}}>
        <div><img src={searchIcon} style={{height: '20px', marginRight: '10px'}} />Search for influencers.</div>

        <div style={{marginTop: '48px', marginBottom: '48px'}}><img src={multipleIcon} style={{height: '20px', marginRight: '10px'}} />Find real influencers. </div>

        <div><img src={connectionsIcon} style={{height: '20px', marginRight: '10px'}} />Make connections.</div>
      </div>
      <img src={sapielogo} style={{height: '100%', position: 'absolute', left: '50%', zIndex: '1'}} />
    </div>
    )
    }
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
