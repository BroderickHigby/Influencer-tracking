import React, { Component } from 'react';

const rootStyle = {
    display: 'flex',
    flexGrow: '1',
    //marginTop: '10px',
};

class HomeContent extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default HomeContent;
