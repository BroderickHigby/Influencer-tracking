import React from 'react';
import PropTypes from 'prop-types';

const TextArea = (props) => (
  <div className="form-group">
    <label className="form-label">{props.title}</label>
    <textarea
      className="form-input"
      style={props.resize ? null : {resize: 'none'}}
      name={props.name}
      rows={props.rows}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder} />
  </div>
);

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
