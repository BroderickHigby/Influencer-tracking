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

class CheckboxOrRadioGroup extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitBackward = this.handleSubmitBackward.bind(this);
    this.getPerc = this.getPerc.bind(this);
    this.getBar = this.getBar.bind(this);
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
      <div>
        <b> <label className="form-label"style={{
                          padding: '20px',
                          borderRadius: '1px',
                          border: '0',
                          fontSize: '1.7em',
                          fontWeight: 'bold'
                      }}> {this.props.title}
        </label> </b>


        <div className="checkbox-group" style={{justifyContent: 'center'}}>

        <form>
        <div style={{maxHeight: '300px', overflow: 'auto'}}>
      {this.props.options.map(opt => {
          return (
          <label key={opt} className="form-label capitalize" style={{minWidth: '500px', fontSize: '1.1em', fontWeight: '100', fontColor: '#E8E8E8'}}>
            <input
              className="form-checkbox"
              name={this.props.setName}
              onChange={this.props.controlFunc}
              value={opt}
              checked={ this.props.selectedOptions.indexOf(opt) > -1 }
              type={this.props.type} /> {opt}
              <br/>
          </label>

        )
      })}
      </div>
      <br />
      <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[0], border: "solid 5px #008080", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginleft: '10px', marginRight: '-4px'}}></div>
      <div className="strike-through" style={{display: 'inline-block', width: this.getBar()[1], border: "solid 5px #E8E8E8", borderRadius: '4px', marginTop: '5px', marginBottom: "1px", marginRight: '10px', zIndex: '-1'}}></div>
      <div style={{display: 'inline-block'}}> <p style={{marginRight: '5px'}}> {this.getPerc().substring(0,2)}% </p> </div>
      <button onClick={this.handleSubmitBackward} style={prevbuttonStyle}> Prev </button>
      <button onClick={this.handleSubmit} style={buttonStyle}> Next </button>
      </form>

      </div>
    </div>
    );
  }
}

CheckboxOrRadioGroup.propTypes = {
  title: propTypes.string.isRequired,
  type: propTypes.oneOf(['checkbox', 'radio']).isRequired,
  setName: propTypes.string.isRequired,
  options: propTypes.array.isRequired,
  selectedOptions: propTypes.array,
  controlFunc: propTypes.func.isRequired,
  level: propTypes.number,
  total: propTypes.number
};

export default CheckboxOrRadioGroup;
