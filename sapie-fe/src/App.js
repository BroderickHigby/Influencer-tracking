import React, { Component } from 'react';
import { Store } from 'react-rebind';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';

import Body from './layout/Body';
import Header from './layout/Header';

import Home from './page/Home';
import Search from './page/Search';

import actions from './actions';

class App extends Component {

    get initialStore() {
        return {
            resources: {
                concept: [],
                part: [],
                rule: []
            }
        };
    }

    render() {
        return (
            <BrowserRouter>
              <Store actions={actions} initial={this.initialStore}>
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
              </Store>
            </BrowserRouter>
        );
    }
}

export default App;
