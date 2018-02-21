import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';
import axios from 'axios';


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
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        };
        console.log('DOING AXIOS');
	console.log(postData);
	console.log(axiosConfig);
        axios.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/run_query', postData, axiosConfig)
        .then(function (response) {
	    console.log("GREAT SUCCESS (in borat accent)");
	    console.log(response.data);
            influencerList = response.data.query_results;
            console.log(influencerList);
        })
	.catch(function (error) {
    		console.log(error);
  	});
    }

    render() {
        return (
            <React.Fragment>
              <Fetcher root="/api/" endpoint="influencer" query={this.props.location.search}>
                <Content>
                  <Filler />
                  <Sidebar hideSm></Sidebar>
                  <MainContent>
                    <div>
                        {influencerList.map(function(d, idx) {
                            return (<li key={idx}><h2>{d.name}</h2> <img src={d.avatar} alt="profile pic"/><h3>Social Authority: {d.socialauthority}Address: {d.residence}Job: {d.job}Company: {d.company}Birthdate {d.birthdate}Sex: {d.sex}Email: {d.mail}</h3></li>)
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
