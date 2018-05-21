import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import CampaignForm from "./components/CampaignForm"


class DigitalCampaign extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (

        <div stlye={{justifyContent: 'center'}}>
          <h3 style={{marginLeft: '30px'}}>Launch a Campaign!</h3>
          <CampaignForm />
        </div>
        )
    }
  }

export default DigitalCampaign;
