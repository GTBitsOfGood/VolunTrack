import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

const TextArea = props => (
  <FormGroup>
    <ControlLabel>{props.label}</ControlLabel>
    <FormControl componentClass="textarea" {...props} />
  </FormGroup>
);

TextArea.propTypes = {
  label: PropTypes.string
};

export default TextArea;
