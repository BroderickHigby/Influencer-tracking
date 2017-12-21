import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import MenuBar from '../layout/MenuBar';
import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
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
