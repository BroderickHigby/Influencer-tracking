import React, { Component } from 'react';
import WebFont from 'webfontloader';



/* Importing font */
WebFont.load({
  google: {
    families: ['Montserrat:300,400,700', 'sans-serif']
  }
});

const rootStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    fontFamily: 'Montserrat'
};

class Body extends Component {
    render() {
        return (
            <div style={rootStyle}>
              {this.props.children}
            </div>
        );
    }
}

export default Body;
