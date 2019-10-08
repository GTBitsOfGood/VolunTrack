import React from 'react';
import styled from 'styled-components';
import EventTable from './EventTable';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `
};

const EventManager = () => {
  return (
    <Styled.Container>
      <EventTable></EventTable>
    </Styled.Container>
  );
};

export default EventManager;
