import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'react-bootstrap/lib/Checkbox';

const InputCheck = props => <Checkbox {...props}>{props.label}</Checkbox>;

InputCheck.propTypes = {
  label: PropTypes.string
};

export default InputCheck;
