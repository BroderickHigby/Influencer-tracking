import React, { Component } from 'react';
import classNames from 'classnames';

const rootStyle = {
    backgroundColor: 'var(--white-color)',
    color: 'var(--primary-color)',
    fontSize: '16px',
    flexGrow: '1',
    flexDirection: 'column',
    lineHeight: '22px',
    maxWidth: '500px',
    padding: '5px'
};

class MainContent extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default MainContent;