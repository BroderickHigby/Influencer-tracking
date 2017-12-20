import React, { Component } from 'react';

const rootStyle = {
    backgroundColor: 'var(--light-color)',
    display: 'flex',
    flexGrow: '1',
    minHeight: '40px',
    lineHeight: '40px',
    padding: '0 20px'
};

class MenuBar extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default MenuBar;

