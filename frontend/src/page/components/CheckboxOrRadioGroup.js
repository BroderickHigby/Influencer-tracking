import React from 'react';
import PropTypes from 'prop-types';

const CheckboxOrRadioGroup = (props) => (
  <div style={{maxHeight: '300px', overflow: 'auto'}}>
    <label className="form-label">{props.title}</label>
    <div className="checkbox-group" style={{maxHeight: '300px', overflow: 'auto'}}>
      {props.options.map(opt => {
        return (
          <label key={opt} className="form-label capitalize" style={{fontSize: '1.1em', fontWeight: '100', fontColor: '#E8E8E8'}}>
            <input
              className="form-checkbox"
              name={props.setName}
              onChange={props.controlFunc}
              value={opt}
              checked={ props.selectedOptions.indexOf(opt) > -1 }
              type={props.type} /> {opt}
              <br/>
          </label>
        );
      })}
    </div>
  </div>
);

CheckboxOrRadioGroup.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
  setName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array,
  controlFunc: PropTypes.func.isRequired
};

export default CheckboxOrRadioGroup;
