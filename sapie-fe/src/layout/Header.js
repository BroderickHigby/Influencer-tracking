import React, { Component } from 'react';

const rootStyle = {
    backgroundColor: 'var(--primary-color)',
    boxShadow: '-5px -1px 8px 1px black',
    color: 'var(--white-color)',
    display: 'flex',
    fontWeight: '600',
    fontSize: '28px',
    flexGrow: '1',
    lineHeight: '55px',
    minHeight: '55px',
    padding: '0 20px',
    zIndex: '1'
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
