import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

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
    display: 'inline-block',
    lineHeight: '40px',
    width: '100px',
    height: '40px',
    marginRight: '20px',
    textDecoration: 'none'
};

class BigSearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = { search: '', goSearch: false };
    }

    get changeHandler() {
        return (evt) => this.setState({ search: evt.target.value });
    }

    get searchHandler() {
        return (evt) => this.setState({ goSearch: true });
    }

    render() {
        if (this.state.goSearch) {
            const url = `/app/search?query=${this.state.search}`;
            return <Redirect push={true} to={url} />;
        }
        return (
            <div style={rootStyle}>
              <input type="text"
                     placeholder="Search for influencers..."
                     style={inputStyle}
                     value={this.state.search}
                     onChange={this.changeHandler}
                     />
              <div style={{textAlign: 'center'}}>
                <button style={buttonStyle} onClick={this.searchHandler}>Search</button>
              </div>
            </div>
        );
    }
}

export default BigSearchBox;
