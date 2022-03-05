import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";
import EventTable from "./EventTable";
import { fetchEvents } from "../../../actions/queries";
import EventCreateModal from "./EventCreateModal";
import EventEditModal from "./EventEditModal";
import EventDeleteModal from "./EventDeleteModal";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { differenceInCalendarDays } from 'date-fns';
import variables from "../../../design-tokens/_variables.module.scss";

const isSameDay = a => b => {
  return differenceInCalendarDays(a, b) === 0;
}

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
    width: 6.5rem;
    height: 3rem;
    margin-top: 2rem;
    
    &:focus {
      background: white;
      outline: none;
      border: none;
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
    font-family:Inter;
    text-align:left;
    font-size:36px;
    font-weight:bold;
  `,
  Date: styled.div`
    font-family:Inter;
    text-align:left;
    font-size:28px;
    font-weight:bold;
  `,
}; 

const EventManager = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);

  const onRefresh = () => {
    setLoading(true);
    fetchEvents()
      .then((result) => {
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
          setDates(result.data.events);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateClicked = () => {
    setShowCreateModal(true);
  };

  const toggleCreateModal = () => {
    setShowCreateModal((prev) => !prev);
    onRefresh();
  };
  useEffect(() => {
    onRefresh();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currEvent, setCurrEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onEditClicked = (event) => {
    setShowEditModal(true);
    setCurrEvent(event);
  };
  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
    onRefresh();
  };
  const onDeleteClicked = (event) => {
    setShowDeleteModal(true);
    setCurrEvent(event);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
    onRefresh();
  };

  const [value,setDate] = useState(new Date());

  const onChange = (value, event) => {
    setDate(value);
    let datestr = value.toString();
    let selectDate = new Date(datestr).toISOString().split('T')[0];
    
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

  const formatJsDate = (jsDate, separator = "/") => {
    return [
        String(jsDate.getFullYear()).padStart(4, '0'),
        String(jsDate.getMonth() + 1).padStart(2, "0"),
        String(jsDate.getDate()).padStart(2, "0")
    ].join(separator)
}
  const setMarkDates = ({date, view}, markDates) => {
    const fDate = formatJsDate(date, "-")
    let tileClassName = "";
    let test = [];
    for(let i = 0; i < markDates.length; i++) {
      test.push(markDates[i].date.slice(0,10));
    }
    if (test.includes(fDate)) {
      tileClassName = "marked";
    }
    return (tileClassName !== "") ? tileClassName : null;
  }
  
  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.EventContainer>
          <Styled.Events>Events</Styled.Events>
          <Styled.Date>{value.toDateString()}</Styled.Date>
        </Styled.EventContainer>
        <Styled.Button onClick={onCreateClicked}>
          <Icon color="grey3" name="add" />
          <span>Create</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <Styled.Content>
        <Calendar 
          onChange={onChange}
          value={value}
          tileClassName={({date, view}) => setMarkDates({date, view}, markDates)}
        />
        <EventTable
        events={events}
        onEditClicked={onEditClicked}
        onDeleteClicked={onDeleteClicked}
        >
        </EventTable>
        <EventCreateModal open={showCreateModal} toggle={toggleCreateModal} />
        <EventEditModal
          open={showEditModal}
          toggle={toggleEditModal}
          event={currEvent}
        />
        <EventDeleteModal
          open={showDeleteModal}
          toggle={toggleDeleteModal}
          event={currEvent}
        />
      </Styled.Content>
    </Styled.Container>
  );
};

export default EventManager;
