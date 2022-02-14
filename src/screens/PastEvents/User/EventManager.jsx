import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";
import EventTable from "./EventTable";
import { fetchEvents } from "../../../actions/queries";
import { updateEvent } from "./eventHelpers";

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
    justify-content: right;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
  `,
};

const EventManager = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }

  useEffect(() => {
    onRefresh();
  }, []);

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

  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.Button onClick={onRefresh} >
          <Icon color="grey3" name="refresh" />
          <span style={{ color: "black" }}>Refresh</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <EventTable
        events={events}
        loading={loading}
        user={user}
      >
        {" "}
      </EventTable>
    </Styled.Container>
  );
};

export default EventManager;
