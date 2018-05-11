import React from 'react';
import PropTypes from 'prop-types';

const PromoArea = (props) => (
  <div className="form-group">
    <label className="form-label">{props.title}</label>
    <br />
    <textarea
      className="form-input"
      style={{
          //width: '90%',
          padding: '20px 28px',
          margin: '8px 0',
          fontSize: '1.4em ',
          borderRadius: '20px',
          border: 'Transparent'
      }}
      name={props.name}
      rows={props.rows}
      value={props.content}
      onChange={props.controlFunc}
      placeholder={props.placeholder} />
  </div>
);

PromoArea.PropTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  resize: PropTypes.bool,
  placeholder: PropTypes.string,
  controlFunc: PropTypes.func.isRequired
};

export default PromoArea;
