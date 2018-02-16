import React, { Component } from 'react';
import { Fetcher, Repeater, Text, Property, Scope } from 'react-rebind';
import Lorem from 'react-lorem-component';

import MenuBar from '../layout/MenuBar';
import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';
import axios from 'axios';

const divStyle = {
    border: 'solid 1px var(--dark-color)',
    margin: '20px 0',
    padding: '5px'
};
var influencerList = [];
class Search extends Component {
    constructor(props) {
        super(props);
        console.log('In CONSTRUCTOR');
        var postData = {
            queryString: this.props.location.search
            //queryString: this.props.location.search.split("=")[1]
        };
        console.log("GRGRGRGRGRGR!!!");
        console.log(postData.queryString);
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*"
            }
        };
        console.log('DOING AXIOS');
        axios.post('http://127.0.0.1:5000/run_query', postData, axiosConfig)
        .then(function (response) {
            influencerList = response.data.query_results;
            console.log(influencerList);
        });
    }

    render() {
        const data = [{"name":"test1"}, {"name":"test2"}];
        return (
            <React.Fragment>
              <Fetcher root="/api/" endpoint="influencer" query={this.props.location.search}>
                <Content>
                  <Filler />
                  <Sidebar hideSm></Sidebar>
                  <MainContent>
                    <div>
                        {influencerList.map(function(d, idx) {
                            return (<li key={idx}><h2>{d.name}</h2> <img src={d.avatar} alt="profile pic"/><h3>Social Authority: {d.socialauthority}<br/>Address: {d.residence}<br/>Job: {d.job}<br/>Company: {d.company}<br/>Birthdate {d.birthdate}<br/>Sex: {d.sex}<br/>Email: {d.mail}</h3></li>)
                        })}
                    </div>
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
