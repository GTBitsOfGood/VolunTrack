import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EventTable from './EventTable';
import { fetchEvents } from 'components/AdminDash/queries';

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
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const onRefresh = () => {
    setLoading(true);
    fetchEvents()
      .then(result => {
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Styled.Container>
      <EventTable events={events} loading={loading}></EventTable>
    </Styled.Container>
  );
};

export default EventManager;
