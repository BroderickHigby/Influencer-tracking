import React, { Component } from 'react';

const rootStyle = {
    display: 'flex',
    flexGrow: '1'
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

