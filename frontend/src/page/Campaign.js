import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import CampaignForm from "./components/CampaignForm"


class Campaign extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div className="container">
            <div className="columns">
              <div className="col-md-9 centered">
                <h3>Launch a Campaign!</h3>
                <CampaignForm />
              </div>
            </div>
          </div>
        )
    }
  }

export default Campaign;
