import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";
import EventTable from "./EventTable";
import { fetchEvents } from "../../../actions/queries";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
    color: black;
  `,
};

const EventManager = () => {

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const onRefresh = () => {
    setLoading(true);
    fetchEvents(undefined, new Date().toLocaleDateString("en-US"))
      .then((result) => {
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

  const [currEvent, setCurrEvent] = useState(null);
  
  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.Button onClick={onRefresh}>
          <Icon color="grey3" name="refresh" />
          <span> Refresh</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <EventTable
        events={events}
        loading={loading}
      >
        {" "}
      </EventTable>
    </Styled.Container>
  );
};

export default EventManager;
