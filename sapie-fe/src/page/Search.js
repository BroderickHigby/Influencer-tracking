import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import MenuBar from '../layout/MenuBar';
import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

class Search extends Component {
    render() {
        return (
            <React.Fragment>
              <MenuBar>Search here...</MenuBar>
              <Content>
                <Filler />
                <Sidebar hideSm><Lorem /></Sidebar>
                <MainContent>
                  <Lorem />
                </MainContent>
                <Sidebar hideMd><Lorem /></Sidebar>
                <Filler />
              </Content>
            </React.Fragment>
        );
    }
}

export default Search;
