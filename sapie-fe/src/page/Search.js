import React, { Component } from 'react';
import { Fetcher, Repeater, Text, Property, Scope } from 'react-rebind';
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
              <Fetcher root="/api/" endpoint="influencer" query={this.props.location.search}>
                <Content>
                  <Filler />
                  <Sidebar hideSm>&gt;&gt;&gt;</Sidebar>
                  <MainContent>
                    <Repeater scope="resources.influencer.results">
                      <div style={{margin: '20px 0'}}>
                        <Property name="src" scope="avatar">
                          <img />
                        </Property>
                        <p><Text scope="username" /></p>
                        <p><Text scope="mail" /></p>
                        <p>Social Authority: <Text scope="socialauthority" /></p>
                      </div>
                    </Repeater>
                  </MainContent>
                  <Sidebar hideMd>&lt;&lt;&lt;</Sidebar>
                  <Filler />
                </Content>
              </Fetcher>
            </React.Fragment>
        );
    }
}

export default Search;
