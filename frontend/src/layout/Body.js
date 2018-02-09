import React, { Component } from 'react';

const rootStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1'
};

class Body extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default Body;
