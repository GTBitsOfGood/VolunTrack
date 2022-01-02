import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Styled = {
  Container: styled.div`
    display: flex;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    overflow: hidden;
    width: 100%;
  `,
  Item: styled.div`
    flex: 1;
    text-align: center;
    padding: 0.5rem 1rem;
    font-weight: ${props => (props.selected ? 600 : 300)};
    color: ${props => (props.selected ? 'white' : props.theme.grey5)};
    background: ${props => (props.selected ? props.theme.primary : props.theme.grey9)};
  `
};

const OptionsSelected = ({ options, selected }) => (
  <Styled.Container>
    {options.map((option, index) => (
      <Styled.Item key={index} selected={selected.includes(option)}>
        {option}
      </Styled.Item>
    ))}
  </Styled.Container>
);

export default OptionsSelected;

OptionsSelected.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.array
};
