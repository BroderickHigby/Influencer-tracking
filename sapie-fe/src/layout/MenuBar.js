import React, { Component } from 'react';

const rootStyle = {
    backgroundColor: 'var(--light-color)',
    boxShadow: '-5px -1px 8px 1px black',
    display: 'flex',
    flexGrow: '1',
    minHeight: '40px',
    lineHeight: '40px',
    marginBottom: '10px',
    padding: '0 20px',
    zIndex: '1'
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

