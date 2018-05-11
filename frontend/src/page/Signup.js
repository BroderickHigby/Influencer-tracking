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
import { updateCustomAttributes } from '../libs/awsLib';


import config from "../config";
import Flexbox from 'flexbox-react';

import logo from "../logos/halfLogo.png";
import Login from "./Login.js";

import sapielogo from "../logos/sapielogo.png";
import searchIcon from "../icons/search.svg";
import connectionsIcon from "../icons/connections.svg";
import multipleIcon from "../icons/multiple.svg";
import ReactPlayer from 'react-player'
import Popup from "reactjs-popup";




const submitButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

const demoButtonStyle = {
  backgroundColor: '#FFFFFF',
  color:'#4379b3',
  borderRadius: '20px',
  border: '0',
  paddingLeft: '3px'
}

const iconStyle = {
  height: '10px',
  marginRight: '10px'
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
      newUser: null,
      promoCode: ""
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

    </div>

    <form onSubmit={this.handleSubmit} style={{}}>
    <br />
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

    {/*
    <FormGroup controlId="promoCode" bsSize="large">
      <FormControl
        value={this.state.promoCode}
        onChange={this.handleChange}
        type="promo"
        placeholder= "Promotion Code"
      />
    </FormGroup>
    */}

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
    <div style={{fontSize:'1.125em', fontWeight: '400', marginTop: '25px'}}>Watch Sapie in Action?

    <Popup
        trigger={<button style={demoButtonStyle}>View Demo</button>}
        position="right center"
        modal
        closeOnDocumentClick
      >
        <div style={{minWidth: '400px'}}>
          <div>
            <ReactPlayer url='https://youtu.be/Rf0L7LYVhBM' playing />
          </div>
        </div>
    </Popup>
      </div>
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
