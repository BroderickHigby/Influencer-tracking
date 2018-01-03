import React, { Component } from 'react';
import classNames from 'classnames';

const rootStyle = {
    backgroundColor: 'var(--white-color)',
    color: 'var(--primary-color)',
    fontWeight: '600',
    fontSize: '14px',
    flexDirection: 'column',
    width: '200px',
    padding: '5px'
};

class Sidebar extends Component {
    render() {
        const rootClass = classNames({
            'hide-flex-sm': this.props.hideSm,
            'hide-flex-md': this.props.hideMd
        });
        return (
            <div style={rootStyle} className={rootClass}>
              {this.props.children}
            </div>
        );
    }
}

export default Sidebar;
