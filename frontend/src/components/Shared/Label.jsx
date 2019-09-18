import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Styled = {
  Label: styled.p`
    font-weight: 400;
    color: ${props => props.theme.grey3};
  `
};

const Label = ({ text }) => <Styled.Label>{text}</Styled.Label>;

export default Label;

Label.propTypes = {
  text: PropTypes.string.isRequired
};
