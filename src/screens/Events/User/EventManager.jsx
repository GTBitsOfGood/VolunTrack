import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "reactstrap";
import styled from "styled-components";
import { fetchEvents } from "../../../actions/queries";
import Icon from "../../../components/Icon";
import variables from "../../../design-tokens/_variables.module.scss";
import { registerForEvent, updateEvent } from "./eventHelpers";
import EventTable from "./EventTable";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  `,
  HeaderContainer: styled.div`
    width: 60%;
    max-width: 80rem;
    display: flex;
    justify-content: end;
    margin: 0 auto;
  `,
  Button: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 7rem;
    height: 3rem;
    margin-top: 2rem;

    &:hover {
      background: gainsboro;
    }
    &:focus {
      background: white;
      box-shadow: none;
    }
  `,
  Content: styled.div`
    width: 60%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    align-items: start;
  `,
  EventContainer: styled.div`
    width: 78%;
    max-width: 80rem;
    display: flex;
    flex-direction column;
    justify-content: end;
    margin-bottom: 1rem;
  `,
  Events: styled.div`
    font-family: Inter;
    text-align: left;
    font-size: 36px;
    font-weight: bold;
  `,
  Date: styled.div`
    font-family: Inter;
    text-align: left;
    font-size: 28px;
    font-weight: bold;
  `,
};

const EventManager = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const {
    data: { user },
  } = useSession();

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setLoading(true);

    const events = (await fetchEvents())?.data?.events;
    if (events) setEvents(events);

    setLoading(false);
  };

  const onRegister = async (event) => {
    const changedEvent = {
      ...event,
      volunteers: event.volunteers.concat(user._id),
    }; // adds userId to event
    const updatedEvent = await registerForEvent({ user, event: changedEvent });
    setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e))); // set event state to reflect new event

    onRefresh();
  };

  const onUnregister = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      volunteers: event.volunteers.filter(
        (volunteer) => volunteer !== user._id
      ),
    };
    const updatedEvent = await updateEvent(changedEvent);
    setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));

    onRefresh();
  };

  const [value, setDate] = useState(new Date());

  const onChange = (value, event) => {
    setDate(value);
    let datestr = value.toString();
    let selectDate = new Date(datestr).toISOString().split("T")[0];

    setLoading(true);
    fetchEvents(selectDate, selectDate)
      .then((result) => {
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.EventContainer>
          <Styled.Events>Events</Styled.Events>
          <Styled.Date>{value.toDateString()}</Styled.Date>
        </Styled.EventContainer>
        <Styled.Button onClick={onRefresh}>
          <Icon color="grey3" name="refresh" />
          <span>Refresh</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <Styled.Content>
        <Calendar onChange={onChange} value={value} />
        <EventTable
          events={events}
          onRegister={onRegister}
          onUnregister={onUnregister}
          user={user}
        >
          {" "}
        </EventTable>
      </Styled.Content>
    </Styled.Container>
  );
};

export default EventManager;
