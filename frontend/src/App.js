import React, { Component } from 'react';
import { Store } from 'react-rebind';
import { withRouter } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Routes from './Routes';
import actions from './actions';

import { authUser, signOutUser, getCurrentUser } from "./libs/awsLib";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      isAuthenticated: false,
      isAuthenticating: true,
      subscribed: false
    };
  }

  userDetails = id => {
    this.setState({user: id});
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.userDetails("");
    this.props.history.push("/app/login");
  }

  async componentDidMount() {
  try {
    if (await authUser()) {
      this.userHasAuthenticated(true);
      this.userDetails(getCurrentUser().Username);
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
        userDetails: this.userDetails,
        isAuthenticated: this.state.isAuthenticated,
        userHasAuthenticated: this.userHasAuthenticated,
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
