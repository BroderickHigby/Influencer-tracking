import React from 'react';
import PropTypes from 'prop-types';

const SingleInput = (props) => (
  <div className="form-group">
    <label className="form-label" style={{marginRight: '6px'}}>{props.title}</label>
    <input
      style={{
          width: '60%',
          padding: '6px 10px',
          margin: '8px 0',
          fontSize: '1.1em '
      }}
      className="form-input"
      name={props.name}
      type={props.inputType}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder} />
  </div>
);

SingleInput.propTypes = {
  inputType: PropTypes.oneOf(['text', 'number']).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  controlFunc: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  placeholder: PropTypes.string,
};

export default SingleInput;
