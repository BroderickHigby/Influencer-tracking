import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

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

    constructor(props) {
        super(props);
        this.state = { goSearch: false };
    }

    get searchHandler() {
        return () => this.setState({ goSearch: true });
    }

    render() {
        if (this.state.goSearch) {
            return <Redirect to="/app/search" />;
        }
        return (
            <div style={rootStyle}>
              <input type="text" placeholder="Search for influencers..." style={inputStyle} />
              <div style={{textAlign: 'center'}}>
                <input style={buttonStyle} type="button" value="Search" onClick={this.searchHandler} />
              </div>
            </div>
        );
    }
}

export default BigSearchBox;
