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
import uparrow from '../uparrow.svg';
import downarrow from '../downarrow.svg';
import neutralarrow from '../neutralarrow.svg';

var Loader = require('react-loader');


const styleContent = {
  width: '80%',
}

const iconStyle = {

  height: '20px',
  margin: '0 10px'

}

const arrowStyle = {
  height: '15px',
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
  padding: '0px',
  width: '100%',
  left: '0',
  margin: '0'
}

const leftStyle = {
  height: '200px',
  overflow: 'hidden',
  padding: '0',
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
}

const bottomRightStyle = {
  height: '150px',
  width: '100%',
  padding: '0 20px',
  backgroundColor: '#f9f9fa',
  display: 'inline-block',

}

const influenceStyle = {
  color: '#711AAC',
  fontSize: '1.5em',
  margin: '15px 0 0 0',
  fontWeight: '400',
  marginBottom: '-20px'
}

const restStyleLeft = {
  color: 'rgba(0,0,0, .5)',
  display : 'table-cell',
  width: '30%',
}
const restStyleRight = {
  color: 'rgba(0,0,0, .5)',
  display : 'table-cell',
  width: '40%',
  height: '100%',
  float: 'top',
  paddingLeft: '5px'
}

const restStyleEnd = {
  color: 'rgba(0,0,0, .5)',
  display : 'table-cell',
  width: '35%',
  height: '100%',
  paddingLeft: '10px'
}

const restStyleBottom = {
  color: 'rgba(0,0,0, .5)',
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

const truncation = (strD, length) => {
  var ending = "...";
  if((typeof strD) == 'string') {
    if (strD.length > length) {
      return strD.substring(0, length - ending.length) + ending;
    }
  }
    return strD;
}

const overHundred = (num) => {
    if (num > 99.9) {
      return 100;
    }
    return num;
}

const findGrowth = (arr, num) => {
  var firstDate = "";
  var lastDate = arr[arr.length-1];

  var lastNum = 0;
  var firstNum = 0;

  var i = 0;
  var j = 0;

  if (num > (arr.length-1)) {
    num = arr.length-1;
  }
  firstDate = arr[arr.length-num-1];

  for (i = lastDate.length; i > 0; i--) {
      if(lastDate.charAt(i) === " ")  {
        lastNum = lastDate.substring(i, lastDate.length);
        break;
      }
  }
  lastNum = getNumber(lastNum);

  for (j = firstDate.length; j > 0; j--) {
      if(firstDate.charAt(j) === " ")  {
        firstNum = firstDate.substring(i, firstDate.length);
        break;
      }
  }

  firstNum = getNumber(firstNum);
  return rounder(((lastNum - firstNum) * 1.0/ (firstNum * 1.0)) * 100, 4);


}

const rounder = (num, power) => {

   var multiplicator = Math.pow(10, power);
   num = parseFloat((num * multiplicator).toFixed(11));
   var test =(Math.round(num) / multiplicator);
   return +(test.toFixed(power));
}

const getNumber = (str) => {
  var num = 0;

  if (str.charAt(str.length-1) === 'k') {
    num = parseInt(str.substring(0, str.length-1)) * 1000;
  }
  else if (str.charAt(str.length-1) === 'm') {
    num = parseInt(str.substring(0, str.length-1)) * 1000000;
  }
  else {
    num = parseInt(str);
  }
  return num;
}

const getFollowers = (map) => {
  var totalFollowersIG =0;
  var followersIG = 0;

  var IGposts = 0;
  var IGpostsTotal = 0;

  var TWposts =0;
  var TWpoststotal =0;

  var totalFollowersYT =0;
  var followersYT = 0;

  var totalFollowersTW =0;
  var followersTW = 0;

  var totalYTvid = 0;
  var totalYTview = 0;

  var YTview = 0;
  var YTvid = 0;

   for (var key in map) {

     if (map[key].instagram.followers_count != "")
        followersIG = getNumber(map[key].instagram.followers_count);
     else
        followersIG = 0;

     if (map[key].instagram.posts_count != "")
        IGposts = getNumber(map[key].instagram.posts_count);
     else
        IGposts = 0;

     if (map[key].youtube.statistics.subscriberCount != "")
        followersYT = getNumber(map[key].youtube.statistics.subscriberCount);
     else
        followersYT = 0;

     if (map[key].youtube.statistics.viewCount != "")
        YTvid = getNumber(map[key].youtube.statistics.viewCount);
     else
        YTvid = 0;

     if (map[key].youtube.statistics.videoCount != "")
        YTview = getNumber(map[key].youtube.statistics.videoCount);
     else
        YTview = 0;

     if (map[key].twitter.followers_count != "")
        followersTW = (map[key].twitter.followers_count);
     else
        followersTW = 0;

     if (map[key].twitter.posts_count != "")
        TWposts = (map[key].twitter.posts_count);
     else
        TWposts = 0;


     if (!isNaN(followersIG)) {
       totalFollowersIG += parseInt(followersIG); }

     if (!isNaN(IGposts)) {
       IGpostsTotal += parseInt(IGposts); }

     if (!isNaN(TWposts)) {
       TWpoststotal += parseInt(TWposts); }

     if (!isNaN(followersYT)) {
       totalFollowersYT += parseInt(followersYT); }

     if (!isNaN(followersTW)) {
       totalFollowersTW += parseInt(followersTW);
     }

     if (!isNaN(YTview)) {
       totalYTview += parseInt(YTview); }

     if (!isNaN(YTvid)) {
       totalYTvid += parseInt(YTvid); }

   }
  var toReturn = [totalFollowersIG, totalFollowersYT, totalFollowersTW,
                  totalYTvid, totalYTview, IGpostsTotal, TWpoststotal];
  return toReturn;
}

const truncateNumbers = (num) => {
  if (num === 0) {
    return num;
  }


  if ((num/1000000000) > 1) {
    return ((num/1000000000.0, 1) + " billion"); }

  else if ((num/1000000) > 1) {
    return (rounder(num/1000000.0, 1) + " million"); }

  else if ((num/1000) > 1) {
    return (rounder(num/1000.0, 1) + " thousand"); }

  else {
    return num;
  }
}

var assoc = "";
var twitt = "";
var instag = "";
var locate = "";
var events = "";
var brands = "";

var count = 0;
var countIG = 0;
var countTW = 0;
var countYTFoll = 0;
var countYTVid = 0;
var countYTView = 0;
var countFB =0;

var influencerList = [];
class Search extends Component {

  handleClick() {
    console.log("CLICKED");
    window.location = "./home";
  }

  constructor(props) {
    super(props);
    var strD = " ";

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
      {
        influencerList.length ? (
          <Sidebar hideSm>
            We found... <br />
            <div style={{color: 'rgba(0,0,0,0.5)', fontSize: '1em', padding: '3px'}}>

              <i>{Object.keys(influencerList).length}</i> influencers <br /><br />
            </div>
            We analyzed...
            <div style={{color: 'rgba(0,0,0,0.5)', fontSize: '1em', padding: '3px'}}>

              <i>{truncateNumbers(getFollowers(influencerList)[0])}</i> Instagram followers<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[5])}</i> Instagram posts<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[1])}</i> Youtube subscribers<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[4])}</i> Youtube videos<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[3])}</i> Youtube views<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[2])}</i> Twitter followers<br /><br />
              {/* <i>{truncateNumbers(getFollowers(influencerList)[6])}</i> Tweets<br /><br /> */}


            </div>
          </Sidebar>
        ) : (
          ""
        )
      }

      <div style={styleContent}>

      <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
      {influencerList.map(function(d, idx) {
        return (

          <div key={idx} style={styleBlock}>

          <div class="panel panel-default">
          <div class="row" style={rowStyle}>
          {d.keywords}
          <div class="col-sm-2" style={leftStyle}>
          <img src={d.youtube.snippet.thumbnails.high.url} alt="profile pic" style={styleImage}/>
          </div>
          <div class="col-sm-10" style={rightStyle}>
          <div style={topRightStyle}>
          <div style={styleTitle}>{truncation(d.youtube.snippet.title, 30)} </div>
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
          {String(overHundred(d.influencer_score)).substr(0,4)} &#37; influence
          </div>
          <div style={{position: 'relative', height: '60px', marginTop: '20px'}}>
          <div style={restStyleLeft}>

            {numberWithCommas(d.youtube.statistics.subscriberCount)} subscribers<br></br>
            {numberWithCommas(d.youtube.statistics.viewCount)} views<br></br>
            {numberWithCommas(d.youtube.statistics.videoCount)} videos


          </div>
          <div style={restStyleRight}>
          {
            d.twitter.followers_count ? (
              /*twitt = ("Twitter Followers: " + numberWithCommas(d.twitter.followers_count))*/
              <p style={{margin: '0'}}>Twitter Followers:  {numberWithCommas(d.twitter.followers_count)}</p>
            ) : (
              ""
            )
          }
          {
            d.instagram.followers_count ? (
              <p style={{margin: '0'}}>Instagram Followers: {numberWithCommas(d.instagram.followers_count)} </p>

            ) : (
              ""
            )
          }
          {
            d.locations ? (
              d.locations.toString() ? (
                locate = ("Locations: " + truncation(d.locations.toString(), 15))
              ) : (
                ""
              )
            ) : (
              ""
            )
          }
          </div>

          <div style={restStyleEnd}>
          {
            d.yt_growth ? (
              d.yt_growth.toString() ? (
                (isNaN(findGrowth(d.yt_growth, 7))) ? (
                  ""
                ) : (
                  (findGrowth(d.yt_growth, 7) > 0) ? (
                    <p style={{margin: '0'}}>YT trend: {findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                  ) : (
                    (findGrowth(d.yt_growth, 7) == 0) ? (
                        <p style={{margin: '0'}}>YT trend: {findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                    ) : (
                        <p style={{margin: '0'}}>YT trend: {findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
                    )
                  )
                )
              ) : ( "" )
            ) : ( "" )
          }

          {
            d.ig_growth ? (
              d.ig_growth.toString() ? (
                (isNaN(findGrowth(d.ig_growth, 7))) ? (
                  ""
                ) : (
                  (findGrowth(d.ig_growth, 7) > 0) ? (
                    <p style={{margin: '0'}}>IG trend: {findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                  ) : (
                    (findGrowth(d.ig_growth, 7) == 0) ? (
                        <p style={{margin: '0'}}>IG trend: {findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                    ) : (
                        <p style={{margin: '0'}}>IG trend: {findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
                    )
                  )
                )
              ) : ( "" )
            ) : ( "" )
          }
          {
            d.twitter_growth ? (
              d.twitter_growth.toString() ? (
                (isNaN(findGrowth(d.twitter_growth, 7))) ? (
                  ""
                ) : (
                  (findGrowth(d.twitter_growth, 7) > 0) ? (
                    <p style={{margin: '0'}}>Twt trend: {findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                  ) : (
                    (findGrowth(d.twitter_growth, 7) == 0) ? (
                        <p style={{margin: '0'}}>Twt trend: {findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                    ) : (
                      (findGrowth(d.twitter_growth, 7).toString().substring(0,4) == "-0.0") ? (
                        <p style={{margin: '0'}}>Twt trend: 0.00% <img src={neutralarrow} style={arrowStyle} /> </p>
                      ) : (
                        <p style={{margin: '0'}}>Twt trend: {findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
                      )
                    )
                  )
                )
              ) : ( "" )
            ) : ( "" )
          }

          </div>
          </div>
          <div style={restStyleBottom}>
          <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse"+idx} aria-expanded="false" aria-controls={"collapse"+idx} style={{color: '#711aac'}}>
          view more
          </a>

          </div>
          </div>
          </div>
          </div>

            <div id={"collapse"+idx} class="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading"+idx} style={{backgroundColor: '#f9f9fa'}}>
              <div class="panel-body">
              <div class="row">
              <div class="col-sm-2" style={{height: '100%', display: 'table-cell'}}>
              <br/>
              </div>
              <div clas="col-sm-10">
              <div style={{color: 'rgba(0,0,0,0.5)', fontSize: '1em', height: '100%', display: 'table-cell', padding: '10px 20px'}}>
              Description: {d.youtube.brandingSettings.channel.description}
              <br/>
              <br />
              Keywords: {d.youtube.brandingSettings.channel.keywords}
              <br />
              {
                d.associated_websites ? (
                  "Websites: " + d.associated_websites
                ) : (
                  ""
                )
              }
              <br/>
              {
                d.locations ? (
                  "Locations: " + d.locations
                ) : (
                  ""
                )
              }
              <br/>
              {
                d.branded_products ? (
                  "Branded Products: " + d.branded_products
                ) : (
                  ""
                )
              }
              </div>
              </div>
              </div>
              </div>
            </div>

          </div>

          </div>)
        })}

              </div>
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
