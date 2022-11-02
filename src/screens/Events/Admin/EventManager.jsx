import { differenceInCalendarDays } from "date-fns";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "reactstrap";
import styled from "styled-components";
import { fetchEvents } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import EventCreateModal from "./EventCreateModal";
import EventDeleteModal from "./EventDeleteModal";
import EventEditModal from "./EventEditModal";
import EventTable from "./EventTable";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const isSameDay = (a) => (b) => {
  return differenceInCalendarDays(a, b) === 0;
};

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-y: 2rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow: hidden;
  `,
  Button: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 9.5rem;
    height: 2.5rem;
    margin-top: 2rem;
    margin-bottom: 2vw;
  `,
  Content: styled.div``,
  EventContainer: styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  `,
  Events: styled.div`
    text-align: left;
    font-size: 36px;
    font-weight: bold;
  `,
  Date: styled.div`
    text-align: left;
    font-size: 28px;
    font-weight: bold;
  `,
  Left: styled.div`
    margin-left: 10vw;
    display: flex;
    flex-direction: column;
  `,
  Right: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 3vw;
  `,
  ButtonRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  DateRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Back: styled.p`
    font-size: 14px;
    margin-left: 10px;
    padding-top: 8px;
    text-decoration: underline;
    color: ${variables.primary};
    cursor: pointer;
  `,
  EventFilter: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 2rem;
  `,
};

const EventManager = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterOn, setFilterOn] = useState(false);
  const [dropdownOn, setDropdownOn] = useState(false);
  const [dropdownVal, setDropdownVal] = useState("All Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);
  const [showBack, setShowBack] = useState(false);

  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }
  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setLoading(true);
    fetchEvents()
      .then((result) => {
        if (result && result.data && result.data.events) {
          // result.data.events = result.data.events.filter(function (event) {
          //   const currentDate = new Date();
          //   return new Date(event.date) > currentDate;
          // });
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

  const [value, setDate] = useState(new Date());

  let splitDate = value.toDateString().split(" ");
  const [dateString, setDateString] = useState(
    splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]
  );

  const onChange = (value, event) => {
    if (Date.now() !== value) setShowBack(true);
    setDate(value);
    let datestr = value.toString();
    let splitDate = value.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
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

  const formatJsDate = (jsDate, separator = "/") => {
    return [
      String(jsDate.getFullYear()).padStart(4, "0"),
      String(jsDate.getMonth() + 1).padStart(2, "0"),
      String(jsDate.getDate()).padStart(2, "0"),
    ].join(separator);
  };

  const setMarkDates = ({ date, view }, markDates) => {
    const fDate = formatJsDate(date, "-");
    let tileClassName = "";
    let test = [];
    for (let i = 0; i < markDates.length; i++) {
      test.push(markDates[i].date.slice(0, 10));
    }
    if (test.includes(fDate)) {
      tileClassName = "marked";
    }
    return tileClassName !== "" ? tileClassName : null;
  };

  const setDateBack = () => {
    const currentDate = new Date();
    setDates(currentDate);
    setDate(currentDate);
    let splitDate = currentDate.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
    setShowBack(false);
    onRefresh();
  };

  const toggle = () => {
    setDropdownOn(!dropdownOn);
  };

  const changeValue = (e) => {
    setDropdownVal(e.currentTarget.textContent);
    const value = e.currentTarget.textContent;
    if (value == "Public Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => !event.isPrivate));
    } else if (value == "Private Group Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => event.isPrivate));
    } else if (value == "All Events") {
      setFilterOn(false);
    }
  };

  return (
    <Styled.Container>
      <Styled.Left>
        <Styled.EventContainer>
          <Styled.Events>Events</Styled.Events>
          <Styled.DateRow>
            <Styled.Date>{dateString}</Styled.Date>
            {showBack && (
              <Styled.Back onClick={setDateBack}>Back to Today</Styled.Back>
            )}
          </Styled.DateRow>
        </Styled.EventContainer>
        <Calendar
          onChange={onChange}
          value={value}
          tileClassName={({ date, view }) =>
            setMarkDates({ date, view }, markDates)
          }
        />
      </Styled.Left>
      <Styled.Right>
        <Styled.ButtonRow>
          <Dropdown isOpen={dropdownOn} toggle={toggle}>
            <DropdownToggle caret>{dropdownVal}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <div onClick={changeValue}>Public Events</div>
              </DropdownItem>
              <DropdownItem>
                <div onClick={changeValue}>Private Group Events</div>
              </DropdownItem>
              <DropdownItem>
                <div onClick={changeValue}>All Events</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Styled.Button onClick={onCreateClicked}>
            <span style={{ color: "white" }}>Create new event</span>
          </Styled.Button>
        </Styled.ButtonRow>
        <Styled.Content>
          {events.length == 0 ? (
            <Styled.Events>No Events Scheduled on This Date</Styled.Events>
          ) : (
            <EventTable
              dateString={dateString}
              events={filterOn ? filteredEvents : events}
              onEditClicked={onEditClicked}
              onDeleteClicked={onDeleteClicked}
            ></EventTable>
          )}
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
      </Styled.Right>
    </Styled.Container>
  );
};

export default EventManager;
