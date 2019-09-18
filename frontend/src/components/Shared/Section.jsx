import React from 'react';
import styled from 'styled-components';
import Heading from './Heading';
import PropTypes from 'prop-types';

const horizontalFlex = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Styled = {
  Container: styled.section`
    height: auto;
    width: 100%;
    font-size: ${props => `${props.headingSize + 2}rem` || '3rem'};
    ${props => props.horizontalFlex && horizontalFlex}
  `
};

/**
 * @param {headingSize}: can be any number with each larger value increasing the font size
 */

const Section = ({ heading, headingSize, horizontal, children }) => (
  <Styled.Section horizontalFlex={horizontal}>
    <Heading headingSize={headingSize}>{heading}</Heading>
    {children}
  </Styled.Section>
);

Section.propTypes = {
  heading: PropTypes.string.isRequired,
  headingSize: PropTypes.number
};
