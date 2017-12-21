import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Home from './page/Home';
import Search from './page/Search';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
              <Body>
                <Header>
                  <Link to="/app/home">Sapie Space</Link>
                </Header>
                <Switch>
                  <Route path="/app/home" component={Home} />
                  <Route path="/app/search" component={Search} />
                  <Redirect to="/app/home" />
                </Switch>
              </Body>
            </BrowserRouter>
        );
    }
}

export default App;
