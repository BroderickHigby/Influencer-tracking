import React, { Component } from 'react';
import { Store } from 'react-rebind';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Home from './page/Home';
import Search from './page/Search';
import Routes from './Routes';
import actions from './actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      isAuthenticated: false,
      Subscribed: false
    };
  }

  userDetails = id => {
    this.setState({user: id});
  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  handleLogout = event => {
    this.userHasAuthenticated(false);
    this.userDetails("");
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
        <Store actions={actions} initial={this.initialStore}>
          <Body>
            <Header handleLogout ={this.handleLogout} isAuthenticated={this.state.isAuthenticated} user={this.state.user} />
            <Routes childProps={childProps}/>
          </Body>
        </Store>
      );
    }
}

export default App;
