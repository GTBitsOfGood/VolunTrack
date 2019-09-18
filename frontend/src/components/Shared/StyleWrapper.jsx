import React from 'react';
import PropTypes from 'prop-types';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html: {
    font-size: 16px;
  }
  * {
    box-sizing: border-box;
  }
  body: {
    margin: 0;
  }
`;

const theme = {
  primary: '#b35fd0',
  grey1: 'hsl(0, 0%, 10%)',
  grey3: 'hsl(0, 0%, 30%)',
  grey5: 'hsl(0, 0%, 50%)',
  grey7: 'hsl(0, 0%, 75%)',
  grey8: 'hsl(0, 0%, 80%)',
  grey9: 'hsl(0, 0%, 95%)',
  primaryGrey: '#607177',
  danger: {
    base: 'hsl(0, 100%, 63%)',
    text: 'hsl(0, 100%, 30%)'
  },
  warning: {
    base: 'hsl(55, 76%, 87%)',
    text: 'hsl(58, 76%, 25%)'
  },
  success: {
    base: 'hsl(128, 43%, 86%)',
    text: 'hsl(127, 100%, 21%)'
  },
  default: {
    base: 'hsl(0, 0%, 90%)',
    text: 'hsl(0, 0%, 30%)'
  }
};

const StyleWrapper = ({ children }) => (
  <React.Fragment>
    <GlobalStyle />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </React.Fragment>
);

export default StyleWrapper;

StyleWrapper.propTypes = {
  children: PropTypes.object
};
