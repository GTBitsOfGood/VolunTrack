import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { Icon } from 'components/Shared';
import EventTable from './EventTable';
import { fetchEvents } from 'components/AdminDash/queries';
import { updateEvent } from './eventHelpers';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: right;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
  `
};

const EventManager = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

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

  const onRegister = async event => {
    const changedEvent = { ...event, volunteers: event.volunteers.concat(user._id) };
    const updatedEvent = await updateEvent(changedEvent);
    setEvents(events.map(e => (e._id === event._id ? updatedEvent : e)));

    onRefresh();
  };

  const onUnregister = async event => {
    const changedEvent = {
      ...event,
      volunteers: event.volunteers.filter(volunteer => volunteer !== user._id)
    };
    console.log(changedEvent);
    const updatedEvent = await updateEvent(changedEvent);
    setEvents(events.map(e => (e._id === event._id ? updatedEvent : e)));

    onRefresh();
  };

  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.Button onClick={onRefresh}>
          <Icon color="grey3" name="refresh" />
          <span>Refresh</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <EventTable
        events={events}
        loading={loading}
        onRegister={onRegister}
        onUnregister={onUnregister}
        user={user}
      >
        {' '}
      </EventTable>
    </Styled.Container>
  );
};

export default EventManager;
