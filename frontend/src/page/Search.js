import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';
import axios from 'axios';
import face from '../facebook.svg';
import insta from '../instagram.svg';
import twitter from '../twitter.svg';
import googlePlus from '../google-plus.svg';
import email from '../email.svg';
import ReactLoading from 'react-loading';

var Loader = require('react-loader');


const styleContent = {
  width: '60%',

}

const iconStyle = {

  height: '20px',
  margin: '0 10px'

}

const styleBlock = {
  marginBottom: '50px'
}

const styleTitle = {
  fontSize: '1.5em',
  fontWeight: '400',
  color: 'white',
  display: 'inline',
}

const industryStyle =  {
  display: 'inline',
  fontSize: '1.3em',
  marginRight: '50px'
}

const styleImage = {
  height: '200px',
  borderRadius: '20px 0 0 20px',

  position: 'absolute',
  top: '0',
  left: '50%',
  transform: 'translate(-50%,0)',
  minWidth: '100%',
  maxWidth: 'none',
  textAlign: 'center',
  margin: '0 auto'
}

const rowStyle = {
  padding: '0',
}

const leftStyle = {
  height: '200px',
  overflow: 'hidden',
  padding: '0',
  borderRadius: '20px 0 0 20px',
  backgroundColor: 'red'
}

const rightStyle = {
  height: '200px',
  padding: '0 0 0 0',
  margin: '0',
}

const styleInnerContent = {
  color: 'black',
  fontSize: '1em',
}

const topRightStyle =  {
  backgroundColor: '#711AAC',
  height: '50px',
  padding: '10px 20px',
  margin: '0',
  color: 'white',
  display: 'inline-block',
  width: '100%',
  borderRadius: '0 20px 0 0'
}

const bottomRightStyle = {
  height: '150px',
  width: '100%',
  padding: '0 20px',
  backgroundColor: '#f9f9fa',
  display: 'inline-block',
  borderRadius: '0 0 20px 0'

}

const influenceStyle = {
  color: '#711AAC',
  fontSize: '1.5em',
  margin: '15px 0 0 0',
  fontWeight: '400'
}

const restStyle = {
  color: 'rgba(0,0,0, .5)'
}

const descriptionStyle = {
  position: 'absolute',
  color: 'rgba(0,0,0,0.5)',
  top: '0',
  left: '50%',
  display: 'inline',
  fontSize: '.7em',

}

const expand =  (()=>{

})

const backButtonStyle = {
  backgroundColor: '#711AAC',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em',
  display: 'none'
}

const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



var influencerList = [];
class Search extends Component {

  handleClick() {
    console.log("CLICKED");
    window.location = "./home";
  }

  constructor(props) {
    super(props);
    this.state = {IL: [], loading: true};
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

  state = {
    loading: true
  };


  componentWillMount(){
    console.log("Will mount");
    influencerList = [];
    this.setState({loading: true}); //optional
  }

  componentDidMount(){
    console.log("Did mount")
    this.setState({loading: false})
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
          <div class="row" style={rowStyle}>
          {d.keywords}
          <div class="col-sm-2" style={leftStyle}>
          <img src={d.youtube.snippet.thumbnails.high.url} alt="profile pic" style={styleImage}/>
          </div>
          <div class="col-sm-10" style={rightStyle}>
          <div style={topRightStyle}>
          <div style={styleTitle}>{d.youtube.snippet.title} </div>
          {
            d.facebook.url ? (
              <a href={d.facebook.url} target="_blank"><img src={face} style={iconStyle} />
              </a>

            ) : (
              ""
            )
          }

          {
            d.instagram.url ? (
              <a href={d.instagram.url} target="_blank"><img src={insta} style={iconStyle} />
              </a>
            ) : (
              ""
            )
          }

          {
            d.twitter.url ? (
              <a href={d.twitter.url} target="_blank"><img src={twitter} style={iconStyle} />
              </a>
            ) : (
              ""
            )
          }

          {
            d.google_plus_url ? (
              <a href={d.google_plus_url} target="_blank"><img src={googlePlus} style={iconStyle} />
              </a>
            ) : (
              ""
            )
          }
          {
            d.email ?  (
              <a href={"mailto:" + d.email} target="_top"><img src={email} style={iconStyle} />
              </a>
            ) : (
              ""
            )

          }
          </div>

          <div style={bottomRightStyle}>
          <div style={influenceStyle}>
          {String(d.influencer_score).substr(0,2)} &#37; influence
          </div>
          <div style={restStyle}>
          {numberWithCommas(d.youtube.statistics.subscriberCount)} subscribers <br/>
          {numberWithCommas(d.youtube.statistics.viewCount)} views <br/>
          {numberWithCommas(d.youtube.statistics.videoCount)} videos <br/>
          {d.youtube.brandingSettings.channel.description}
          </div>
          </div>
          </div>
          </div>


          </div>)
        })}
        {
          influencerList.length ? (
            ""
          ) : (
            <div style={{marginTop: '100px'}}><
            center>
            <ReactLoading type={"bars"} color={"black"} height='200px' width='200px' />
            <button onClick={this.handleClick} style={backButtonStyle}>Back to Search</button>
            </center>
            </div>
          )
        }
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
