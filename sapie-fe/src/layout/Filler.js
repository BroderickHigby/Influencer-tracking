import React, { Component } from 'react';
import classNames from 'classnames';

const rootStyle = {
    flexGrow: '1'
};

class Filler extends Component {
    render() {
        return (
            <div style={rootStyle}>
              &nbsp;
            </div>
        );
    }
}

export default Filler;
