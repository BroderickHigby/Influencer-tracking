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

class SingleInput extends Component {
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
    <label className="form-label" style={{marginRight: '6px', fontSize: '1.7em'}}>{this.props.title}</label>
    <br />
    <input
      style={{
          width: '60%',
          padding: '10px 10px',
          margin: '8px 0',
          fontSize: '1.1em ',
          borderRadius: '10px'
      }}
      className="form-input"
      name={this.props.name}
      type={this.props.inputType}
      value={this.props.content}
      onChange={this.props.controlFunc}
      placeholder={this.props.placeholder}
      level={this.props.level}
      total={this.props.total}/>
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


SingleInput.propTypes = {
  inputType: propTypes.oneOf(['text', 'number']).isRequired,
  title: propTypes.string.isRequired,
  name: propTypes.string.isRequired,
  controlFunc: propTypes.func.isRequired,
  content: propTypes.oneOfType([
    propTypes.string,
    propTypes.number,
  ]).isRequired,
  placeholder: propTypes.string,
  level: propTypes.number,
  total: propTypes.number
};

export default SingleInput;
