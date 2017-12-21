import React, { Component } from 'react';

const rootStyle = {
    display: 'flex',
    fontSize: '20px',
    flexDirection: 'column',
    flexGrow: '1',
    marginTop: '100px'
};

const inputStyle = {
    border: '1px solid var(--secondary-color)',
    borderRadius: '5px',
    flexGrow: '1',
    height: '50px',
    lineHeight: '50px',
    marginBottom: '20px',
    padding: '5px 18px'
};

const buttonStyle = {
    backgroundColor: 'var(--primary-color)',
    border: '0',
    borderRadius: 'var(--button-radius)',
    color: 'var(--light-color)',
    lineHeight: '40px',
    width: '100px',
    height: '40px',
    marginRight: '20px'
};

class BigSearchBox extends Component {
    render() {
        return (
            <div style={rootStyle}>
              <input type="text" placeholder="Search for influencers..." style={inputStyle} />
              <div style={{textAlign: 'center'}}>
                <input style={buttonStyle} type="button" value="Search" />
              </div>
            </div>
        );
    }
}

export default BigSearchBox;
