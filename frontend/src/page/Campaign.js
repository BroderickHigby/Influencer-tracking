import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import CampaignForm from "./components/CampaignForm"

import phys from './components/icons/physical.svg'
import digit from './components/icons/digital.svg'

var lightColor = '#66b2b2';
var darkColor = '#008080';
var lightGray = '#E8E8E8';

const buttonStyle = {
  backgroundColor: '#66b2b2',
  borderRadius: '20px',
  color: 'white',
  padding: '10px 10px',
  border: '0',
  fontSize: '1em'
}

const iconStyle = {
  height: '250px',
  marginBottom: '5px',
  maringTop: '5px',
  paddingBottom: '25px',
  display: 'inline-block'
}

class Campaign extends Component {
    constructor(props) {
        super(props);
        this.handleClickP = this.handleClickP.bind(this);
        this.handleClickD = this.handleClickD.bind(this);
      }

      handleClickP() {
        window.location = "./physicalcampaign"
      }

      handleClickD() {
        window.location = "./digitalcampaign"
      }

    render() {
      return (

        <div stlye={{justifyContent: 'center'}}>
          <center>
          <br/>
          <div style={{display: 'inline-block', padding: '20px', margin: '20px', marginRight: '60px'}}>

            <a href={"_blank"} target="_blank"><img src={phys} style={iconStyle} /> </a>
            <h3> Physical Campaigns </h3>
            {/*<button onClick={this.handleClickP} style={buttonStyle}>Lauch Campaign</button> */}
            <h4> Coming soon to Sapie.Space </h4>


          </div>

          <div style={{display: 'inline-block', padding: '20px', margin: '20px', marginLeft: '60px', width: '40%'}}>

            <a href={"_blank"} target="_blank"><img src={digit} style={iconStyle} /> </a>
            <h3> Digital Campaigns </h3>
            <p style={{fontSize: '1em', textAlign: 'Left', fontColor: 'grey'}}> &emsp; Starting a digital campaign allows you to specify your exact needs for digital marketting to us through a simple form.
                                          You will be able to specify the age demographic you would like you target, the brand feel, MPAA rating
                                          budget, location, industry, and any other specific needs. We will then personally match you with the best
                                          possible influencer for your brand! </p>
            <button onClick={this.handleClickD} style={buttonStyle}>Lauch Campaign</button>

          </div>
          </center>
        </div>
      )
    }
  }

export default Campaign;
