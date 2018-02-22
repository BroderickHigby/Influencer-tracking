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
	this.state = {IL: []};
        console.log('In CONSTRUCTOR');
        var postData = {
            queryString: this.props.location.search.split("=")[1]
            //queryString: this.props.location.search.split("=")[1]
        };
        console.log("GRGRGRGRGRGR!!!");
        console.log(postData.queryString);
	console.log("$$$$$$$$$$$$$$$$");
        let axiosConfig = {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        };
        console.log('DOING AXIOS');
	console.log(postData);
	console.log(axiosConfig);
	let currentComponent = this;
        axios.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5000/run_query', postData, axiosConfig)
        .then(function (response) {
	    console.log("GREAT SUCCESS (in borat accent)");
	    console.log(response.data);
            influencerList = response.data.query_results;
            console.log(influencerList);
	    currentComponent.setState({IL: influencerList});
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
                    <div>
                        {influencerList.map(function(d, idx) {
                            return (<div key={idx}><h2>{d.snippet.title}</h2> <img src={d.brandingSettings.image.bannerMobileHdImageUrl} alt="profile pic"/><h3>Platform: {d.platform}<br/>Industry: {d.industry}<br/>Channel Description: {d.brandingSettings.channel.description} <br/>Keywords: {d.brandingSettings.channel.keywords} <br/>Language: {d.snippet.defaultLanguage}<br/>Videos: {d.statistics.videoCount}<br/>View Count: {d.statistics.videoCount}<br/>Subscriber Count: {d.statistics.subscriberCount}</h3></div>)
                        })}
                    </div>
                  <Sidebar hideMd></Sidebar>
                  <Filler />
                </Content>
              </Fetcher>
            </React.Fragment>
        );
    }
}

export default Search;
