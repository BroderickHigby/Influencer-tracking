import React from 'react';
import PropTypes from 'prop-types';

const SingleInput = (props) => (
  <div className="form-group">
    <label className="form-label">{props.title}</label>
    <input
      className="form-input"
      name={props.name}
      type={props.inputType}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder} />
  </div>
);

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
};

export default SingleInput;
