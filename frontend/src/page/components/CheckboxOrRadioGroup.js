import React from 'react';

const CheckboxOrRadioGroup = (props) => (
  <div>
    <label className="form-label">{props.title}</label>
    <div className="checkbox-group">
      {props.options.map(opt => {
        return (
          <label key={opt} className="form-label capitalize">
            <input
              className="form-checkbox"
              name={props.setName}
              onChange={props.controlFunc}
              value={opt}
              checked={ props.selectedOptions.indexOf(opt) > -1 }
              type={props.type} /> {opt}
          </label>
        );
      })}
    </div>
  </div>
);

CheckboxOrRadioGroup.propTypes = {
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['checkbox', 'radio']).isRequired,
  setName: React.PropTypes.string.isRequired,
  options: React.PropTypes.array.isRequired,
  selectedOptions: React.PropTypes.array,
  controlFunc: React.PropTypes.func.isRequired
};

export default CheckboxOrRadioGroup;  
