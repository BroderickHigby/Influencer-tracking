import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import PhysicalCampaignForm from "./components/PhysicalCampaignForm"


class PhysicalCampaign extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (

        <div stlye={{justifyContent: 'center'}}>
          <h3 style={{marginLeft: '30px'}}>Launch a Physical Campaign!</h3>
          <PhysicalCampaignForm />
        </div>
        )
    }
  }

export default PhysicalCampaign;
