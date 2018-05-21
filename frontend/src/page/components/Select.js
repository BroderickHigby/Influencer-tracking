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

class Select extends Component {
  constructor() {
    super();
    this.handleSubmitBackward = this.handleSubmitBackward.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getBar = this.getBar.bind(this);
    this.getPerc = this.getPerc.bind(this);
  }
  getPerc() {
    return this.props.level * 100/this.props.total + " ";
  }

  handleSubmitBackward(evt) {
    evt.preventDefault();
    this.props.onBack();
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit();
  }

  getBar() {
    var value1 = (60 * this.props.level)/this.props.total
    var value2 = (60 - value1) + "%";
    return [value1 + "%", value2]
  }
  render() {
    return (
    <form>
      <select
        name={this.props.name}
        value={this.props.selectedOption}
        onChange={this.props.controlFunc}
        level={this.props.level}
        total={this.props.total}
        style={{padding: '20px', borderRadius: '1px', border: '0', fontSize: '1.5em'}}
        className="form-select">
        <option value="" disabled="true" style={{ fontWeight: 'bold' }}>{this.props.placeholder}</option>
        {this.props.options.map(function(opt, idx) {
          return (
            <option
              key={idx}
              value={opt}>{opt}
            </option>
          )
        })}
      </select>
      <br />
      <br />
      <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[0], border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
      <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[1], border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
      <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> {this.getPerc().substring(0,2)}% </p> </div>
      <button onClick={this.handleSubmitBackward} style={prevbuttonStyle}> Prev </button>
      <button onClick={this.handleSubmit} style={buttonStyle}> Next </button>
    </form>
  );
  }
}

Select.propTypes = {
  name: propTypes.string.isRequired,
  options: propTypes.array.isRequired,
  selectedOption: propTypes.string,
  controlFunc: propTypes.func.isRequired,
  placeholder: propTypes.string,
  level: propTypes.number,
  total: propTypes.number
};

export default Select;
