import React from 'react';
import styled from 'styled-components';

const defaultColors = {
  back: 'hsl(0, 0%, 95%)',
  text: 'hsl(0, 0%, 10%)'
};

const Styled = {
  Button: styled.button`
    background: ${props => (props.theme[props.type] || defaultColors).back};
    color: ${props => (props.theme[props.type] || defaultColors).text};
    border-radius: 2em;
  `
};

const Button = ({ children, type }) => <Styled.Button type={type}>{children}</Styled.Button>;

export default Button;

Button.propTypes = {
  children: PropTypes.object,
  type: PropTypes.string
};
