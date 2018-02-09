import React, { Component } from 'react';

import Content from '../layout/Content';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

import BigSearchBox from '../component/BigSearchBox';

class Home extends Component {
    render() {
        return (
            <React.Fragment>
              <Content>
                <Filler />
                <MainContent>
                  <BigSearchBox />
                </MainContent>
                <Filler />
              </Content>
            </React.Fragment>
        );
    }
}

export default Home;
