import React, { Component } from 'react';
import logo from './logo.svg';

import Body from './layout/Body';
import Header from './layout/Header';

import Home from './page/Home';

class App extends Component {
    render() {
        return (
            <Body>
              <Header>Sapie Space</Header>
              <Home />
            </Body>
        );
    }
}

export default App;
