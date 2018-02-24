import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';
import axios from 'axios';


const styleContent = {
  width: '90%',

}

const styleBlock = {
  marginBottom: '100px'
}

const styleTitle = {
  fontSize: '2em',
  fontWeight: '400',
  color: 'black'
}

const styleImage = {
  width: '100%',
  marginBottom: '20px'
}

const styleInnerContent = {
  color: 'black',
  fontSize: '1em',
}


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
                    <div style={styleContent}>
                        {influencerList.map(function(d, idx) {
                            return (
                            <div key={idx} style={styleBlock}>
                              <h2 style={styleTitle}>{d.snippet.title}</h2> <img src={d.brandingSettings.image.bannerMobileHdImageUrl} alt="profile pic" style={styleImage}/>
                              <span style={styleInnerContent}><b>Platform</b>: {d.platform}<br/><b>Industry</b>: {d.industry}<br/><b>Channel Description</b>: {d.brandingSettings.channel.description} <br/><b>Keywords</b>: {d.brandingSettings.channel.keywords} <br/><b>Language</b>: {d.snippet.defaultLanguage}<br/><b>Videos</b>: {d.statistics.videoCount}<br/><b>View Count</b>: {d.statistics.viewCount}<br/><b>Subscriber Count</b>: {d.statistics.subscriberCount}</span></div>)
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
