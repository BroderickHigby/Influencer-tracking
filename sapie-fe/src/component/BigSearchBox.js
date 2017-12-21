import React, { Component } from 'react';

const rootStyle = {
    display: 'flex',
    fontSize: '20px',
    flexGrow: '1',
    lineHeight: '55px',
    margin: '30px',
    minHeight: '55px',
    padding: '0 20px'
};

const inputStyle = {
    border: '1px solid var(--secondary-color)',
    borderRadius: '5px',
    flexGrow: '1',
    padding: '5px 18px'
};

class BigSearchBox extends Component {
    render() {
        return (
            <div style={rootStyle}>
              <input type="text" placeholder="Search for influencers..." style={inputStyle} />
            </div>
        );
    }
}

export default BigSearchBox;
