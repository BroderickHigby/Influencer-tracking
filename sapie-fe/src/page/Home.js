import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import MenuBar from '../layout/MenuBar';
import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

import BigSearchBox from '../component/BigSearchBox';

const h1Style = {
    fontWeight: '800',
    fontSize: '42px',
    lineHeight: '50px',
    marginTop: '100px',
    textAlign: 'center'
};

class Home extends Component {
    render() {
        return (
            <React.Fragment>
              <Content>
                <Filler />
                <MainContent>
                  <h1 style={h1Style}>Find influencers who<br /> really matter</h1>
                  <BigSearchBox />
                </MainContent>
                <Filler />
              </Content>
            </React.Fragment>
        );
    }
}

export default Home;
