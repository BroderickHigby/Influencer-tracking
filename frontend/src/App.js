import React, { Component } from 'react';
import { Store } from 'react-rebind';
import { withRouter } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Routes from './Routes';
import actions from './actions';
import { authUser, signOutUser, getAuthCurrentUser, getAttributes } from "./libs/awsLib";


class App extends Component {
  constructor(props) {
    super(props);


    this.state = {
      user: null,
      isAuthenticated: false,
      isAuthenticating: true,
      subscribed: false,
      justLoggedIn: true,

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

  userHasLoggedIn = boolean => {
    this.setState({justLoggedIn: boolean});
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
    this.userHasLoggedIn(false);
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.userUpdate(null);
    this.props.history.push("/app/login");
  }

  async componentDidMount() {
    // if (window.Stripe) {
    //   this.setState({stripe: window.Stripe('pk_test_12345')});
    // } else {
    //     document.querySelector('#stripe-js').addEventListener('load', () => {
    //     // Create Stripe instance once Stripe.js loads
    //     this.setState({stripe: window.Stripe('pk_test_Jjys3Yuxu330uiclk4ViXeHM')});
    //   });
    // }

  try {
    if (await authUser()) {
      this.userHasAuthenticated(true);
      this.userUpdate(getAuthCurrentUser());
      if(this.state.justLoggedIn === true){
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
        justLoggedIn: this.state.justLoggedIn,
        userHasAuthenticated: this.userHasAuthenticated,
        subscribed: this.state.subscribed,
        userHasSubscribed: this.userHasSubscribed,
        userJustLoggedIn: this.userJustLoggedIn,
        userHasLoggedIn: this.userHasLoggedIn
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
