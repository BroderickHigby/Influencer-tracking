import React, { Component } from 'react';
import { Fetcher } from 'react-rebind';

import FormContainer from "./components/FormContainer"


class Campaign extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div className="container">
            <div className="columns">
              <div className="col-md-9 centered">
                <FormContainer />
              </div>
            </div>
          </div>
        )
    }
  }

export default Campaign;
