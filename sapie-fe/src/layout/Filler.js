import React, { Component } from 'react';

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
