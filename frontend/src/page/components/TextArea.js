import React, {Component} from 'react';
import propTypes from 'prop-types';

var lightColor = '#66b2b2';
var darkColor = '#008080';
var lightGray = '#E8E8E8';

const buttonStyle = {
  backgroundColor: lightColor,
  borderRadius: '20px',
  color: 'white',
  padding: '5px',
  paddingLeft: '15px',
  paddingRight: '15px',
  border: '0',
  fontSize: '1em',
  display: 'inline-block'
}

const prevbuttonStyle = {
  backgroundColor: lightColor,
  borderRadius: '15px',
  color: 'white',
  padding: '5px',
  paddingLeft: '10px',
  paddingRight: '10px',
  border: '0',
  fontSize: '.8em',
  marginRight: '5px',
  display: 'inline-block'
}

class TextArea extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitBackward = this.handleSubmitBackward.bind(this);

    this.getBar = this.getBar.bind(this);
    this.getPerc = this.getPerc.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit();
  }

  handleSubmitBackward(evt) {
    evt.preventDefault();
    this.props.onBack();
  }

  getBar() {
    var value1 = (60 * this.props.level)/this.props.total
    var value2 = (60 - value1) + "%";
    return [value1 + "%", value2]
  }

  getPerc() {
    return this.props.level * 100/this.props.total + " ";
  }

  render() {
    return (
      <form>
        <label className="form-label">{this.props.title}</label>
        <br />
        <textarea
          className="form-input"
          style={{
              width: '90%',
              padding: '15px',
              margin: '8px 0',
              fontSize: '1.1em ',
              borderRadius: '25px'
          }}
          name={this.props.name}
          rows={this.props.rows}
          value={this.props.content}
          onChange={this.props.controlFunc}
          placeholder={this.props.placeholder} />
          <br />
          <div style={{width: '100%'}}>
          <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[0], border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
          <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[1], border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
          <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> {this.getPerc().substring(0,2)}% </p> </div>
          <button onClick={this.handleSubmitBackward} style={prevbuttonStyle}> Prev </button>
          <button onClick={this.handleSubmit} style={buttonStyle}> Next </button>
         </div>

      </form>
    );
  }
}

TextArea.propTypes = {
  title: propTypes.string.isRequired,
  rows: propTypes.number.isRequired,
  name: propTypes.string.isRequired,
  content: propTypes.string.isRequired,
  resize: propTypes.bool,
  placeholder: propTypes.string,
  controlFunc: propTypes.func.isRequired
};

export default TextArea;
