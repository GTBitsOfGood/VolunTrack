import PropTypes from 'prop-types';
import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

const Text = props => (
  <FormGroup>
    <ControlLabel>{props.label}</ControlLabel>
    <FormControl {...props} />
  </FormGroup>
);
Text.propTypes = {
  label: PropTypes.string
};

export default Text;
