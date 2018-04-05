import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


const rootStyle = {
  marginTop: '20px'
}

const labelStyle = {
  margin: '0 7px',
  fontWeight: '400',
  fontSize: '1em',
  color: 'white',
  backgroundColor: 'grey',
  borderRadius: '2em',
  padding: '5px 10px',
  border: 'none'
}

const titleStyle = {
  fontSize: '1.5em',
  marginBottom: '20px',
  fontWeight: '400',
}


class TopSearches extends Component {

  constructor(props) {
      super(props);
      this.state = { searchValue: '', goSearchTop: false};
  }

  searchTopHandler = (evt) => this.setState({searchValue: evt.target.value, goSearchTop: true});


  render() {
    if(this.state.goSearchTop) {
      const url = `/app/search?query=${this.state.searchValue}`;
      return <Redirect push={true} to={url} />;

    }

    return (
      <div style={rootStyle}>
        <div style={titleStyle}> What people are searching </div>
        <button onClick={this.searchTopHandler} style={labelStyle} value={"soccer"}>soccer</button>
        <button onClick={this.searchTopHandler} style={labelStyle} value={"vegan"}>vegan</button>
        <button onClick={this.searchTopHandler} style={labelStyle} value={"food"}>food</button>
        <button onClick={this.searchTopHandler} style={labelStyle} value={"mma"}>mma</button>
        <button onClick={this.searchTopHandler} style={labelStyle} value={"book blogger"}>book blogger</button>
      </div>
    );
  }

}

export default TopSearches;
