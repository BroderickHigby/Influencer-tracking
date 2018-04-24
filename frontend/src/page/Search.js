import ReactGA from 'react-ga';
import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import { updateCustomAttributes, getAttributes } from '../libs/awsLib';

import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";

import Content from '../layout/Content';
import Sidebar from '../layout/Sidebar';
import MainContent from '../layout/MainContent';
import Filler from '../layout/Filler';
import axios from 'axios';

import face from '../icons/facebook.svg';
import insta from '../icons/instagram.svg';
import twitter from '../icons/twitter.svg';
import googlePlus from '../icons/google-plus.svg';
import email from '../icons/email.svg';
import youtube from '../icons/youtube.svg';
import blank from '../icons/blank.svg';

import US from '../icons/united-states.svg';
import CA from '../icons/canada.svg';
import DE from '../icons/germany.svg';
import UK from '../icons/united-kingdom.svg';
import AU from '../icons/australia.svg';
import world from '../icons/world.svg';
import FR from '../icons/france.svg';

import facePop from '../icons/old_media/facebook.svg';
import instaPop from '../icons/old_media/instagram.svg';
import twitterPop from '../icons/old_media/twitter.svg';
import googlePlusPop from '../icons/old_media/google-plus.svg';
import emailPop from '../icons/old_media/email.svg';

import ytbutton from '../icons/youtubebutton.svg';
import igcam from '../icons/instagramcamera.svg';
import twbird from '../icons/twitterbird.svg';

import ReactLoading from 'react-loading';
import LoadingIcon from '../icons/loading.gif';
import uparrow from '../icons/uparrow.svg';
import downarrow from '../icons/downarrow.svg';
import neutralarrow from '../icons/neutralarrow.svg';
import sapielogo from "../logos/sapielogo90.png";

import Popup from "reactjs-popup";


var Loader = require('react-loader');


const popButtonStyle = {
  backgroundColor: 'Transparent',
  borderRadius: '1px',
  color: 'white',
  border: '1px',
  fontSize: '.7em',
}

const statsButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '10px',
  color: 'white',
  padding: '5px 5px',
  border: '1px',
  fontSize: '.9em'
}

const tipTitle = {
  fontSize: '1.5em',
  fontWeight: '700'
}

const tipDescription = {
  fontSize: '1em',
  marginBottom: '0px'
}

const styleContent = {
  width: '100%',
  marginLeft: '30px',
  display: 'fixed',
  alignItems: 'center',
  justifyContent: 'center',
}

const styleContentBottom = {
  width: '100%',
  marginLeft: '10px',
  display: 'inline-block',
  alignItems: 'center',
  justifyContent: 'center',
}

const iconStyleStats = {
  height: '30px',
  marginLeft: '10px',
}

const statsTextStyle = {
    fontColor: '#66b2b2',
}

const iconStyle = {
  height: '30px',
  margin: '0 3px',
  marginTop: '10px'
}

const arrowStyle = {
  height: '15px',
}

const styleBlock = {
  //marginBottom: '50px',
  width: '27%',
  margin: '25px',
  height: '300px',
  borderRadius: '10px',
  display : 'inline-block',
  minWidth: '247',
  //height: '300px'
  backgroundColor: '#E8E8E8',//'#f9f9fa',
}

const bottomButtons = {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  display : 'flex',
}


const styleTitle = {
  fontSize: '1.4em',
  fontWeight: '400',
  minWidth: '217.25px',
  marginRight: '5px',
  textAlign: 'left',
  marginLeft: '10px',
  display: 'inline-block'
  //display: 'inline',
}

const styleTitlePopup = {
  fontSize: '1.5em',
  fontWeight: '400',
  color: '#66b2b2',
  display: 'inline',
  marginTop: '25px',
  marginBottom: '20px'
}

const topRightStylePopup =  {
  backgroundColor: '#008080',
  //height: '50px',
  margin: '0',
  marginLeft: '-19',
  color: 'white',
  display: 'inline-block',
  width: '100%',
}

const industryStyle =  {
  display: 'inline',
  fontSize: '1.3em',
  marginRight: '50px'
}


const imgStyle = {
  width: '85px',
  height: '85px',
  overflow: 'hidden',
  borderRadius: '50%',
  //marginLeft: '40%',
  //marginRight: '40%'
}

const rightStylePopup = {
  height: '200px',
  margin: '5 5 5 5',
  marginRight: '0px',
}

const rightStyle = {
  //height: '200px',
  padding: '0 0 0 0',
  margin: '0',
}

const styleInnerContent = {
  color: 'black',
  fontSize: '1em',
}

const topRightStyle =  {
  backgroundColor: '#66b2b2',
  height: '50%',
  //padding: '10px 20px',
  paddingBottom: '0px',
  paddingTop: '10px',
  margin: '0',
  color: 'white',
  alignItems: 'center',
  borderRadius: '10px',
  justifyContent: 'center',
  display: 'fixed',

  //display: 'inline-block',
  width: '100%',
}

const bottomRightStyle = {
  height: '100%',
  width: '100%',
  //marginTop: '10px',
  //padding: '20 20px',
  borderRadius: '10px',
  backgroundColor: '#E8E8E8',//'#f9f9fa',
  display: 'inline-block',
}

const iconStylePopup = {
  height: '17px',
  margin: '5px'
}

const iconStyleAccounts = {
  height: '40px',
  margin: '5px',
  padding: '2px',
  marginRight: '10px',
  marginLeft: '15px'
}

const iconStyleTrends = {
  height: '35px',
  margin: '5px',
  padding: '2px',
  marginRight: '1px',
  marginLeft: '15px'
}

const iconStyleCountry = {
  height: '60px',
  margin: '5px',
  padding: '1px',
  marginRight: '10px',
  borderRadius:'30px',
  border: '2px solid #66b2b2',
}


const scoreStyle = {
  color: '#006666',
  fontSize: '1.7em',
  marginTop: '5px',
  marginBottom: '-6px',
  fontWeight: '400',
}

const influenceStyle = {
  color: '#006666',
  fontSize: '1.3em',
  marginBottom: '5px',
  fontWeight: '400',
}


const rowStyle = {
  padding: '0px',
  width: '100%',
  left: '0',
  margin: '0'
}

const leftStyle = {
  height: '150px',
  overflow: 'hidden',
  padding: '0',
  display: 'inline-block'
}

const descriptionStyle = {
  color: 'rgba(0,0,0,0.5)',
  top: '0',
  display: 'inline',
  lineHeight: 'normal',
  fontSize: '.75em',
}

const accountsStyle = {
  display: 'inline-block',
  color: 'rgb(0,0,0,0.75)',
  fontSize: '.81em',
  marginTop: '3px',
  marginLeft:'10px'
}

const styleHandles = {
  //width:'12%',
  display: 'inline-block',
  color: 'rgb(0,0,0,0.5)',
  fontSize: '.75em',
  marginLeft: '2px'
}

const backButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em',
  display: 'none'
}

const compactButtonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '5px',
  color: 'white',
  padding: '6px 6px',
  border: '0',
  fontWeight: '500',
  fontSize: '1em'
}

const styleImage = {
  height: '140px',
  width: '140px',
  borderRadius: '70px',
  border: '4px solid #66b2b2',
  padding: '3px',
  position: 'absolute',
  verticalAlign: 'top',
  top: '0',
  left: '50%',
  transform: 'translate(-50%,0)',
  //minWidth: '100%',
  marginTop: '10px'
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

const getlengths = (user) => {
  //index 1 is Youtube
  //      2 is instagram
  //      3 is Twitter
  var arr = [1, 1, 1];
  var max = 0;
  var i;

  if (!isNaN(user.youtube.statistics.subscriberCount)) arr[0] = parseInt(user.youtube.statistics.subscriberCount);
  else arr[0] =0;

  if (user.instagram) arr[1] = getNumber(user.instagram.followers_count);
  else arr[1] =0;

  if (user.twitter) arr[2] = parseInt(user.twitter.followers_count);
  else arr[2] =0;

  for (i = 0; i < arr.length; i++) {
    if (max < (arr[i])) {
      max = arr[i];
    }
  }
  for (i = 0; i < arr.length; i++) {
    arr[i] = ((arr[i]) * 1.0)/max;
  }
  for (i = 0; i < arr.length; i++) {
    if (arr[i] != 1) {
      arr[i] += .1;
    }
  }
  return arr;
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

const getFBHandle = (str) => {
  var i;
  var count = 0;
  var index =0;
  for (i = str.length-1; i >= 0; i--) {
    if (str.charAt(i) === '/') {
      count++;
      switch(count) {
        case 1:
          index = i;
          break;
        case 2:
          return str.substring(i+1, index);
          break;
      }
    }
  }
  return str;
}

const getIGScreenName = (str) => {
  var i;
  for (i = str.length-2; i >= 0; i--) {
    if (str.charAt(i) === '/') {
      return str.substring(i+1);
    }
  }
  return str;
}
const rounder = (num, power) => {

   var multiplicator = Math.pow(10, power);
   num = parseFloat((num * multiplicator).toFixed(11));
   var test =(Math.round(num) / multiplicator);
   return +(test.toFixed(power));
}

const prettyString = (arr) => {
  var toReturn = arr[0];
  var i;
  for (i = 1; i < arr.length; i++) {
    toReturn = toReturn + ", " + arr[i];
  }
  return toReturn;
}

const addCommas = (str) => {
  var toReturn = "";
  var i;
  var j;
  var flag = false;

  for (i = 0; i < str.length; i++) {
    if (str.charAt(i) === '"') {
      flag = !flag;
    }

    if (str.charAt(i) === ' ') {
      if (!flag) {
        var first = str.substring(0, i);
        var last = str.substring(i);
        toReturn = first + "," + last;
      }
    }
  }
  return toReturn;
}

const getNumber = (str) => {
  var num = 0;
  str = str.replace(/,/g, "");

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

     if (map[key].instagram.followers_count !== "")
        followersIG = getNumber(map[key].instagram.followers_count);
     else
        followersIG = 0;

     if (map[key].instagram.posts_count !== "")
        IGposts = getNumber(map[key].instagram.posts_count);
     else
        IGposts = 0;

     if (map[key].youtube.statistics.subscriberCount !== "")
        followersYT = getNumber(map[key].youtube.statistics.subscriberCount);
     else
        followersYT = 0;

     if (map[key].youtube.statistics.viewCount !== "")
        YTvid = getNumber(map[key].youtube.statistics.viewCount);
     else
        YTvid = 0;

     if (map[key].youtube.statistics.videoCount !== "")
        YTview = getNumber(map[key].youtube.statistics.videoCount);
     else
        YTview = 0;

     if (map[key].twitter.followers_count !== "")
        followersTW = (map[key].twitter.followers_count);
     else
        followersTW = 0;

     if (map[key].twitter.twitter_tweet_count !== "")
        TWposts = (map[key].twitter.twitter_tweet_count);
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

const truncateNumbers2 = (num) => {
  if (num === 0) {
    return num; }
  if ((num/1000000000) > 1) {
    return ((num/1000000000.0, 1) + "B"); }
  else if ((num/1000000) > 1) {
    return (rounder(num/1000000.0, 1) + " M"); }
  else if ((num/1000) > 1) {
    return (rounder(num/1000.0, 1) + "K"); }
  else {
    return num;
  }
}

const truncateNumbers = (num) => {
  if (num === 0) {
    return num; }
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
var count = 0;

var followingCounts = [0, 0, 0];

//var checked = false;

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

    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-116399864-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview(window.location.pathname);

    console.log('In CONSTRUCTOR');

    this.getQuery();
  };

  async getQuery() {
    var emailUser = "";

    var attributes = await getAttributes();
    console.log(attributes);
    var i =0;

    for( i = 0; i< attributes.length; i++){
      if(attributes[i].Name === "email") {
        emailUser = attributes[i].Value;
      }
    }


    if (!this.props.location.search.split("=")[1].replace(/\s/g, '').length) {
      alert("Searches must contain more than empty space");
      window.location = "./app/home";
    }

    var postData = {
      queryString: this.props.location.search.split("=")[1],
      user_email: emailUser
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
    //http://127.0.0.1:5000

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
  }


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
      {/*<Filler />*/}
      {
        influencerList.length ? (
          <Sidebar hideSm>
          <center>
          <a href={"./app/home"} target="_blank">
              <img src={sapielogo} style={{height: '50%', width: '50%', paddingBottom: '20px'}} />
          </a>
          <button onClick={this.handleClick} style={compactButtonStyle}>Back to Search</button>
          <br />
          </center>
          <br />


            <p style={{color: "#008080", paddingLeft: '10px'}}> We found... </p>
            <div style={{color: 'rgba(0,0,0,0.5)', fontSize: '1em', padding: '3px', marginLeft: '20px'}}>

              <i>{Object.keys(influencerList).length}</i> influencers <br /><br />
            </div>
              <p style={{color: "#008080", paddingLeft: '10px'}}> We analyzed... </p>
            <div style={{color: 'rgba(0,0,0,0.5)', fontSize: '1em', padding: '3px', marginLeft: '20px'}}>

              <i>{truncateNumbers(getFollowers(influencerList)[0])}</i> Instagram followers<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[5])}</i> Instagram posts<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[1])}</i> Youtube subscribers<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[4])}</i> Youtube videos<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[3])}</i> Youtube views<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[2])}</i> Twitter followers<br /><br />
              <i>{truncateNumbers(getFollowers(influencerList)[6])}</i> Tweets<br /><br />


            </div>
          </Sidebar>
        ) : (
          ""
        )
      }

      <div style={styleContent}>


      {influencerList.map(function(d, idx) {

        return (

          <div key={idx} style={styleBlock}>

          <div>
          {d.keywords}


          <div style={rightStyle}>
          <div style={topRightStyle}>
          <center>
          <div style={{width: '28%', display: 'inline-block', verticalAlign: 'top', marginLeft: '1px'}}>
            <img src={d.youtube.snippet.thumbnails.high.url} alt="profile pic" style={imgStyle}/>
          </div>

          <div style={{width: '70%', display: 'inline-block'}}>
            <div style={styleTitle}>
              <div style={{  color: 'white', display: 'absolute', fontSize: "1.1em", display: 'inline-block'}}>{truncation(d.youtube.snippet.title, 15)}</div>

              <div className="strike-through" style={{border: "solid .5px white", marginTop: '5px', marginBottom: "1px", marginRight: '10px'}}></div>
              {
                d.facebook.url ? (
                  <a href={d.facebook.url} target="_blank"><img src={facePop} style={iconStylePopup} />
                  </a>
                ) : (
                  ""
                )
              }

              {
                d.instagram.url ? (
                  <a href={d.instagram.url} target="_blank"><img src={instaPop} style={iconStylePopup} />
                  </a>
                ) : (
                  ""
                )
              }

              {
                d.twitter.url ? (
                  <a href={d.twitter.url} target="_blank"><img src={twitterPop} style={iconStylePopup} />
                  </a>
                ) : (
                  ""
                )
              }

              {
                d.google_plus_url ? (
                  <a href={d.google_plus_url} target="_blank"><img src={googlePlusPop} style={iconStylePopup} />
                  </a>
                ) : (
                  ""
                )
              }

              {
                d.email ?  (
                  <a href={"mailto:" + d.email} target="_top"><img src={emailPop} style={iconStylePopup} />
                  </a>
                ) : (
                  ""
                )

              }

              <a href={"_blank"} target="_blank"><img src={blank} style={iconStylePopup} />
              </a>


              <div style={{marginTop: '2px'}}>
                <p style={{fontSize: "1.4em", width: '60%', display: 'inline-block'}}>{String(overHundred(d.influencer_score)).substr(0,4)}&#37;</p>
                <div style={{width:'40%', display: 'inline-block', verticalAlign: 'bottom', marginBottom: '16px'}}>

                <Popup
                    trigger={<button style={popButtonStyle}> <u>More Info</u></button>}
                    position="right center"
                    modal
                    closeOnDocumentClick
                >

                <div className="col-sm-3" style={leftStyle}>
                  <img src={d.youtube.snippet.thumbnails.high.url} alt="profile pic" style={styleImage}/>
                </div>
                <div className="col-sm-8" style={{padding: '7px', margin: '5px', marginLeft:'20px'}}>
                  <p style={styleTitlePopup}> <b>{truncation(d.youtube.snippet.title, 30)} </b> <br />  </p>
                  <div className="strike-through" style={{border: "solid 1px rgb(0,0,0,.35)", borderRadius: '1px'}}>
                  </div>
                  <div style={{marginTop:'0px'}}>
                    <p style={descriptionStyle}> {d.youtube.brandingSettings.channel.description} </p>
                  </div>
                </div>



                <div style = {styleContentBottom}>
                <div style={{width:'100%', display: 'inline-block'}}>
                  {/*Locations, Trends */}
                  <div style={{width: '11%', display: 'inline-block'}}>
                  <p style={accountsStyle}> <center> <b>Audience<br/> Location </b> </center> </p>
                  </div>
                  <div style={{width: '25%', display: 'inline-block'}}>
                  { (d.youtube.snippet.country === "US") ? ( <a href={"_blank"} target="_blank"><img src={US} style={iconStyleCountry} /> </a>) : ( "" ) }
                  { (d.youtube.snippet.country === "UK") ? ( <a href={"_blank"} target="_blank"><img src={UK} style={iconStyleCountry} /> </a>) : ( "" ) }
                  { (d.youtube.snippet.country === "CA") ? ( <a href={"_blank"} target="_blank"><img src={CA} style={iconStyleCountry} /> </a>) : ( "" ) }
                  { (d.youtube.snippet.country === "DE") ? ( <a href={"_blank"} target="_blank"><img src={DE} style={iconStyleCountry} /> </a>) : ( "" ) }
                  { (d.youtube.snippet.country === "FR") ? ( <a href={"_blank"} target="_blank"><img src={FR} style={iconStyleCountry} /> </a>) : ( "" ) }
                  { (d.youtube.snippet.country === "AU") ? ( <a href={"_blank"} target="_blank"><img src={AU} style={iconStyleCountry} /> </a>) : ( "" ) }
                  <a href={"_blank"} target="_blank"><img src={world} style={iconStyleCountry} /> </a>
                  </div>

                  <div style={{width: '10%', display: 'inline-block'}}>
                    <p style={accountsStyle}> <center> <b>Trends</b> </center> </p>
                  </div>

                  <div style={{width: '50%', display: 'inline-block'}}>
                    {
                       d.yt_growth ? (
                         d.yt_growth.toString() ? (
                           (isNaN(findGrowth(d.yt_growth, 7))) ? (
                             ""
                           ) : (
                             (findGrowth(d.yt_growth, 7) > 0) ? (
                               <p style={accountsStyle}>
                                <a href={"_blank"} target="_blank"><img src={ytbutton} style={iconStyleTrends} /> </a>
                                  {findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                             ) : (
                               (findGrowth(d.yt_growth, 7) == 0) ? (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={ytbutton} style={iconStyleTrends} /> </a>{findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                               ) : (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={ytbutton} style={iconStyleTrends} /> </a>{findGrowth(d.yt_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
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
                               <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={igcam} style={iconStyleTrends} /> </a>{findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                             ) : (
                               (findGrowth(d.ig_growth, 7) == 0) ? (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={igcam} style={iconStyleTrends} /> </a>{findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                               ) : (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={igcam} style={iconStyleTrends} /> </a>{findGrowth(d.ig_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
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
                               <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={twbird} style={iconStyleTrends} /> </a>{findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={uparrow} style={arrowStyle} /> </p>
                             ) : (
                               (findGrowth(d.twitter_growth, 7) == 0) ? (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={twbird} style={iconStyleTrends} /> </a>{findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={neutralarrow} style={arrowStyle} /> </p>
                               ) : (
                                 (findGrowth(d.twitter_growth, 7).toString().substring(0,4) == "-0.0") ? (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={twbird} style={iconStyleTrends} /> </a>0.00% <img src={neutralarrow} style={arrowStyle} /> </p>
                                 ) : (
                                   <p style={accountsStyle}><a href={"_blank"} target="_blank"><img src={twbird} style={iconStyleTrends} /> </a>{findGrowth(d.twitter_growth, 7).toString().substr(0,4)}% <img src={downarrow} style={arrowStyle} /> </p>
                                 )
                               )
                             )
                           )
                         ) : ( "" )
                       ) : ( "" )
                     }
                </div>
                </div>



                <div style={{width: '45%', display: 'inline-block', verticalAlign: 'top'}}>
                  <div style={{width: '27%', display: 'inline-block', verticalAlign: 'top'}}>
                    <p style={accountsStyle}> <b>Accounts</b></p>
                  </div>
                  <div style={{width: '70%', marginLeft:'5px', display: 'inline-block'}}>
                  {
                    d.youtube.statistics.subscriberCount ? (
                      <div style={{marginTop: '10px', verticalAlign: 'center'}}>
                      <a href={d.youtube.url} style={{display: 'inline-block', width: '27%'}} target="_blank"><img src={youtube} style={iconStyleAccounts} /> </a>
                      <p style={styleHandles}> @{(d.youtube.snippet.customUrl) ? ( d.youtube.snippet.customUrl ) : ( d.youtube.snippet.title)} </p>
                      </div>
                    ) : (  ""  )
                  }
                  {
                    d.instagram.followers_count ? (
                      <div style={{marginTop: '10px', verticalAlign: 'center'}}>
                      <a href={d.instagram.url} style={{display: 'inline-block', width: '27%'}} target="_blank"><img src={insta} style={iconStyleAccounts} /> </a>
                      <p style={styleHandles}> @{getIGScreenName(d.instagram.url)} </p>
                      </div>
                    ) : ("")
                  }
                  {
                    d.twitter.followers_count ? (
                      <div style={{marginTop: '10px', verticalAlign: 'center'}}>
                      <a href={d.twitter.url} style={{display: 'inline-block', width: '27%'}} target="_blank"><img src={twitter} style={iconStyleAccounts} /> </a>
                      <p style={styleHandles}> @{d.twitter.screen_name} </p>
                      </div>
                    ) : (  ""  )
                  }
                  {
                    d.google_plus_url ? (
                      <div style={{marginTop: '10px', verticalAlign: 'center'}}>
                      <a href={d.google_plus_url} style={{display: 'inline-block', width: '27%'}} target="_blank"><img src={googlePlus} style={iconStyleAccounts} /> </a>
                      <p style={styleHandles}> @{(d.youtube.snippet.customUrl) ? ( d.youtube.snippet.customUrl ) : ( d.youtube.snippet.title)} </p>
                      </div>
                    ) : ( "" )
                  }
                  {
                    d.facebook.url ? (
                      <div style={{marginTop: '10px', verticalAlign: 'center'}}>
                      <a href={d.facebook.url} style={{display: 'inline-block', width: '27%'}} target="_blank"><img src={face} style={iconStyleAccounts} /> </a>
                      <p style={styleHandles}> @{truncation(getFBHandle(d.facebook.url), 15)} </p>
                      </div>
                    ) : ( "" )
                  }
                  </div>
                </div>

                <div style={{width: '45%', display: 'inline-block', verticalAlign: 'top'}}>
                  <div style={{width: '27%', display: 'inline-block', verticalAlign: 'top'}}>
                    {
                      ((d.associated_websites.toString() != "") || (d.branded_products.toString() !== 0) || (d.youtube.brandingSettings.channel.keywords)) ? (
                        <p style={accountsStyle}> <b>Other</b></p>
                      ) : ( "" )
                    }
                  </div>
                  <div style={{width: '70%', marginLeft:'5px', display: 'inline-block'}}>
                  {
                    (d.associated_websites.toString() !== "" ) ? (
                      <p style={accountsStyle}>{prettyString(d.associated_websites)} </p>
                    ) : ( "" )
                  }
                  {
                    (d.branded_products.toString() !== "") ? (
                      <p>Branded Products: {prettyString(d.branded_products)}</p>
                    ) : ( "" )
                  }
                  {
                    (d.youtube.brandingSettings.channel.keywords) ? (
                      <p style={accountsStyle}>Keywords: {addCommas(truncation(d.youtube.brandingSettings.channel.keywords,65))} </p>
                    ) : ( "" )
                  }
                  </div>
                </div>


                </div>

                </Popup>
                </div>
              </div>

              </div>
          </div>

          </center>

          </div>

          <div style={bottomRightStyle}>
          <div>
            {
              d.youtube.statistics.subscriberCount ? (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={d.youtube.url} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={youtube} style={iconStyleStats} /> </a>
                <p style={{width:'12%', display: 'inline-block'}}> {truncateNumbers2(d.youtube.statistics.subscriberCount)} </p>
                <div className="strike-through" style={{width: '65%', display: 'inline-block', width: (150 * getlengths(d)[0]), border: "solid 6px #ff3333", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>

                </div>
              ) : (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={"_blank"} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={blank} style={iconStyleStats} /> </a>
                <p style={{width:'12%', display: 'inline-block'}}> {" "} </p>
                <div className="strike-through" style={{width: '65%', display: 'inline-block', width: "100", border: "solid 6px Transparent", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>

                </div>
              )
            }
            </div>
            <div>
            {
              d.instagram.followers_count ? (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={d.instagram.url} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={insta} style={iconStyleStats} /> </a>
                  <p style={{width:'12%', display: 'inline-block'}}> {truncateNumbers2(d.instagram.followers_count)} </p>

                <div className="strike-through" style={{width: '65%', display: 'inline-block', width: (150 * getlengths(d)[1]), border: "solid 6px #b366ff", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>

                </div>

              ) : (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={"_blank"} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={blank} style={iconStyleStats} /> </a>
                <p style={{width:'12%', display: 'inline-block'}}> {" "} </p>
                <div className="strike-through" style={{width: '65%', display: 'inline-block', width: "100", border: "solid 6px Transparent", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>

                </div>
              )
            }
            </div>
            <div>
            {
              d.twitter.followers_count ? (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={"_blank"} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={twitter} style={iconStyleStats} /> </a>
                  <p style={{width:'12%', display: 'inline-block'}}> {truncateNumbers2(d.twitter.followers_count)} </p>
                  <div className="strike-through" style={{width: '65%', display: 'inline-block', width: (150 * getlengths(d)[2]), border: "solid 6px #00a3cc", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>
                </div>

              ) : (
                <div style={{fontColor: "#FAFAFA", marginTop: '10px', verticalAlign: 'center'}}>
                <p style = {statsTextStyle}>
                <a href={d.twitter.url} style={{display: 'inline-block', width: '16%'}} target="_blank"><img src={blank} style={iconStyleStats} /> </a>
                <p style={{width:'12%', display: 'inline-block'}}> {" "} </p>
                <div className="strike-through" style={{width: '65%', display: 'inline-block', width: "100", border: "solid 6px Transparent", borderRadius: '2px', marginLeft: '10px'}}></div>
                </p>

                </div>
              )
            }
            </div>


          </div>


          </div>


          </div>

          </div>)

        })}

        {
          influencerList.length ? (
            <Filler />

          ) : (
            <div style={{marginTop: '20px', position: 'absolute', margin: '0 auto', width: '90%'}}>

            {/*<button onClick={this.handleClick} style={backButtonStyle}>Back to Search</button>*/}
            <div class="row">
            <div class="col-md-5" style={{textAlign: 'center'}}>
            <div style={{fontSize: '1.5em', fontWeight: '400', marginBottom: '70px'}}> Finding influencers hang tight!</div>
            <img src={LoadingIcon}/>
            </div>
            <div class="col-md-7">
            <div style={{fontSize: '1.5em', marginBottom: '10px'}}>Some tips from our experts...</div>

            <div style={tipTitle}>Make sure you are providing value.</div>
            <div style={tipDescription}>Most influencers get a ton of cold emails. To stand out from the crowd, make sure to offer some value. This will help get their attention and build a strong relationship.  </div>

            <div style={tipTitle}>Give them creative control.</div>
            <div style={tipDescription}>There is a reason the person you are reaching out to is influential. People love their personality! So let them be them. </div>

            <div style={tipTitle}>Make sure to set a goal to measure against.</div>
            <div style={tipDescription}>It is important to set a goal (whether that is revenue, sign ups, pageviews...) to measure against. That way you can prove you were successful! </div>

            <div style={tipTitle}>Set up a way to measure that goal.</div>
            <div style={tipDescription}>The easiest way we have found is to use a url shortener like Bit.ly. If you create a unique url for each influencer you work with, then you will know who the real winners are </div>

            <div style={tipTitle}>Remember the gold rule.</div>
            <div style={tipDescription}>Influencers are people too, so let us just make sure we always ask "would I like this if I was in their position?"  </div>
            </div>
            </div>
            </div>


          )
        }
        </div>

        </Content>
        </Fetcher>
        </React.Fragment>
      );

    }
  }

  export default Search;
