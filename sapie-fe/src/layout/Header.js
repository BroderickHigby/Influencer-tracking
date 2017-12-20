import React, { Component } from 'react';

const rootStyle = {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white-color)',
    display: 'flex',
    fontWeight: '600',
    fontSize: '28px',
    flexGrow: '1',
    lineHeight: '55px',
    miHeight: '55px',
    padding: '0 20px'
};

class Header extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default Header;
