import React, { Component } from 'react';
import { Fetcher, Repeater, Text, Property, Scope } from 'react-rebind';
import Lorem from 'react-lorem-component';

import MenuBar from '../layout/MenuBar';
import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';

const divStyle = {
    border: 'solid 1px var(--dark-color)',
    margin: '20px 0',
    padding: '5px'
};

class Search extends Component {

    render() {
        return (
            <React.Fragment>
              <Fetcher root="/api/" endpoint="influencer" query={this.props.location.search}>
                <Content>
                  <Filler />
                  <Sidebar hideSm></Sidebar>
                  <MainContent>
                    <Repeater scope="resources.influencer.results">
                      <div style={divStyle}>
                        <Property name="src" scope="avatar">
                          <img />
                        </Property>
                        <p><Text scope="username" /></p>
                        <p><Text scope="mail" /></p>
                        <p>Social Authority: <Text scope="socialauthority" /></p>
                      </div>
                    </Repeater>
                  </MainContent>
                  <Sidebar hideMd></Sidebar>
                  <Filler />
                </Content>
              </Fetcher>
            </React.Fragment>
        );
    }
}

export default Search;
