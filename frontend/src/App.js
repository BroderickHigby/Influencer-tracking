import React, { Component } from 'react';
import { Store } from 'react-rebind';
import { withRouter } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Routes from './Routes';
import actions from './actions';
import {CognitoUser} from 'amazon-cognito-identity-js';
import { authUser, signOutUser, getCurrentUser, getAuthCurrentUser, getAttributes } from "./libs/awsLib";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isAuthenticated: false,
      isAuthenticating: true,
      subscribed: false,
      justLoggedIn: true
    };
  }

  userUpdate = loggedIn => {
    this.setState({user: loggedIn});
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  userHasSubscribed = boolean => {
    this.setState({subscribed: boolean});
  }

  async userJustLoggedIn(){
    var i = 0;
    var attributes = await getAttributes();
    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "custom:subs_active"){
        if(attributes[i].Value === "true"){
          this.userHasSubscribed(true);
        }
        break;
      }
    }
    this.setState({justLoggedIn: false});
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.userUpdate(null);
    this.props.history.push("/app/login");
  }

  async componentDidMount() {
  try {
    if (await authUser()) {
      this.userHasAuthenticated(true);
      this.userUpdate(getAuthCurrentUser());
      if(this.state.justLoggedIn == true){
        await this.userJustLoggedIn();
      }
    }
  }
  catch(e) {
    alert(e);
  }

  this.setState({ isAuthenticating: false });
}
    get initialStore() {
      return {
        resources: {
          influencer: {
            results: [
              { display_name: 'Rocketeer', socialauthority: 7 },
              { display_name: 'Monsteer', socialauthority: 5 },
              { display_name: 'Foobarr', socialauthority: 3 },
              { display_name: 'Quxbaz', socialauthority: 1 },
            ]
          }
        }
      };
    }

    render() {
      const childProps = {
        user: this.state.user,
        userUpdate: this.userUpdate,
        isAuthenticated: this.state.isAuthenticated,
        userHasAuthenticated: this.userHasAuthenticated,
        subscribed: this.state.subscribed,
        userHasSubscribed: this.userHasSubscribed
      }

      return (
        !this.state.isAuthenticating &&
        <Store actions={actions} initial={this.initialStore}>
          <Body>
            <Header handleLogout ={this.handleLogout} isAuthenticated={this.state.isAuthenticated} user={this.state.user} />
            <Routes childProps={childProps}/>
          </Body>
        </Store>
      );
    }
}

export default withRouter(App);
