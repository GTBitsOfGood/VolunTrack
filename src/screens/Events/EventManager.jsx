// import { differenceInCalendarDays } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Button as RSButton,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import styled from "styled-components";
import { fetchEvents } from "../../actions/queries";
import variables from "../../design-tokens/_variables.module.scss";
import EventCreateModal from "./Admin/EventCreateModal";
import EventDeleteModal from "./Admin/EventDeleteModal";
import EventEditModal from "./Admin/EventEditModal";
import EventsList from "./EventsList";
import { fetchAttendanceByUserId } from "../../actions/queries";

import { filterAttendance } from "../Stats/helper";

import { useSession } from "next-auth/react";
import router from "next/router";
import PropTypes from "prop-types";
import StatDisplay from "../Stats/User/StatDisplay";
import { updateEvent } from "./eventHelpers";
import ProgressDisplay from "../../components/ProgressDisplay";
import "flowbite-react";

import { Button } from "flowbite-react";
import AdminHomeHeader from "../../components/AdminHomeHeader";

// const isSameDay = (a) => (b) => {
//   return differenceInCalendarDays(a, b) === 0;
// };

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
  Button: styled(RSButton)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 9.5rem;
    height: 2.5rem;
  `,
  TablePadding: styled.div`
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
    @media (max-width: 768px) {
      display: none;
    }
  `,
  Right: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 3vw;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  ButtonRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 2vw;
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
  HomePage: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
    row-gap: 10px;
  `,
  EventFilter: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 2rem;
  `,
  LegendText: styled.p`
    font-size: 20px;
    font-weight: bold;
    margin-top: 30px;
  `,
  LegendImage: styled.img`
    margin-top: 20px;
    width: 20rem;
    height: 5rem;
  `,
};

const EventManager = ({ user, role, isHomePage }) => {
  // eslint-disable-next-line no-unused-vars
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

  const onRefresh = () => {
    setLoading(true);
    fetchEvents(undefined, undefined, user.organizationId)
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
    fetchAttendanceByUserId(userId).then((result) => {
      if (result?.data?.attendances) {
        const filteredAttendance = filterAttendance(
          result.data.attendances,
          startDate,
          endDate
        );
        setAttendance(filteredAttendance);
      }
    });
    onRefresh();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currEvent, setCurrEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const { data: session } = useSession();
  const userId = session.user._id;

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();

    if (!values.startDate) {
      setStartDate("undefined");
    } else {
      let start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      let end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }
  };

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

  const goToRegistrationPage = async (event) => {
    if (event?.eventId) {
      await router.push(`/events/${event.eventId}/register`);
    }
  };

  const onUnregister = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      minors: event.volunteers.filter(
        (minor) => minor.volunteer_id !== user._id
      ),
      volunteers: event.volunteers.filter(
        (volunteer) => volunteer !== user._id
      ),
    };
    const updatedEvent = await updateEvent(changedEvent);
    setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));

    onRefresh();
  };

  const [value, setDate] = useState(new Date());

  let splitDate = value.toDateString().split(" ");
  const [dateString, setDateString] = useState(
    splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]
  );

  const onChange = (value) => {
    if (Date.now() !== value) setShowBack(true);
    setDate(value);
    let datestr = value.toString();
    let splitDate = value.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
    let selectDate = new Date(datestr).toISOString().split("T")[0];

    setLoading(true);
    fetchEvents(selectDate, selectDate, user.organizationId)
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

  // eslint-disable-next-line no-unused-vars
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

  const filterEvents = (events, user) => {
    let arr = [];
    for (let i = 0; i < events.length; i++) {
      if (
        // hide past events for volunteers
        new Date(events[i].date) >= new Date(Date.now() - 2 * 86400000) &&
        (!events[i].isPrivate || events[i].volunteers.includes(user._id))
      ) {
        arr.push(events[i]);
      }
    }
    return arr;
  };

  const toggle = () => {
    setDropdownOn(!dropdownOn);
  };

  const changeValue = (e) => {
    setDropdownVal(e.currentTarget.textContent);
    const value = e.currentTarget.textContent;
    if (value === "Public Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => !event.isPrivate));
    } else if (value === "Private Group Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => event.isPrivate));
    } else if (value === "All Events") {
      setFilterOn(false);
    }
  };

  return (
    <Styled.Container>
      {!isHomePage && (
        <Styled.Left>
          <Styled.EventContainer>
            <Styled.Events>Events</Styled.Events>
            <Styled.DateRow>
              <Styled.Date>{dateString}</Styled.Date>
              {showBack && (
                <Styled.Back onClick={setDateBack}>View All Events</Styled.Back>
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
          <Styled.LegendText>How to read the calendar?</Styled.LegendText>
          <Styled.LegendImage src="/images/Calendar Legend.svg" alt="legend" />
        </Styled.Left>
      )}
      {!isHomePage && (
        <Styled.Right>
          {role === "admin" ? (
            <Styled.ButtonRow>
              <Dropdown isOpen={dropdownOn} toggle={toggle}>
                <DropdownToggle caret>{dropdownVal}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <div onClick={changeValue}>All Events</div>
                  </DropdownItem>
                  <DropdownItem>
                    <div onClick={changeValue}>Public Events</div>
                  </DropdownItem>
                  <DropdownItem>
                    <div onClick={changeValue}>Private Group Events</div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button
                className="bg-primaryColor hover:bg-hoverColor"
                onClick={onCreateClicked}
              >
                Create new event
              </Button>
            </Styled.ButtonRow>
          ) : (
            <Styled.TablePadding></Styled.TablePadding>
          )}
          {events.length === 0 ? (
            <Styled.Events>No Events Scheduled on This Date</Styled.Events>
          ) : (
            <EventsList
              dateString={dateString}
              events={
                user.role === "admin"
                  ? filterOn
                    ? filteredEvents
                    : events
                  : filterEvents(events, user)
              }
              onEditClicked={onEditClicked}
              onDeleteClicked={onDeleteClicked}
              onRegisterClicked={goToRegistrationPage}
              onUnregister={onUnregister}
              user={user}
              isHomePage={isHomePage}
            />
          )}
          <EventCreateModal open={showCreateModal} toggle={toggleCreateModal} />
          <EventEditModal
            open={showEditModal}
            toggle={toggleEditModal}
            event={currEvent}
            setEvent={setCurrEvent}
          />
          <EventDeleteModal
            open={showDeleteModal}
            toggle={toggleDeleteModal}
            event={currEvent}
          />
        </Styled.Right>
      )}
      <Styled.HomePage>
        {isHomePage && user.role === "volunteer" && (
          <>
            <div className="justify-start">
              <p className="mb-2 text-2xl font-bold">Accomplishments</p>
              <div className="flex flex-wrap">
                <ProgressDisplay
                  type={"Events"}
                  attendance={attendance}
                  header={"Events Attended"}
                />
                <ProgressDisplay
                  type={"Hours"}
                  attendance={attendance}
                  header={"Hours Earned"}
                />
              </div>
            </div>
            <EventsList
              dateString={dateString}
              events={
                user.role === "admin"
                  ? filteredEvents
                  : filterEvents(events, user)
              }
              onEditClicked={onEditClicked}
              onDeleteClicked={onDeleteClicked}
              onRegisterClicked={goToRegistrationPage}
              onUnregister={onUnregister}
              user={user}
              isHomePage={isHomePage}
            />
          </>
        )}

        {isHomePage && user.role !== "volunteer" && (
          <>
            <AdminHomeHeader />
            <EventsList
              dateString={dateString}
              events={
                user.role === "admin"
                  ? filterOn
                    ? filteredEvents
                    : events
                  : filterEvents(events, user)
              }
              onEditClicked={onEditClicked}
              onDeleteClicked={onDeleteClicked}
              onRegisterClicked={goToRegistrationPage}
              onUnregister={onUnregister}
              user={user}
              isHomePage={isHomePage}
            />
          </>
        )}
      </Styled.HomePage>
    </Styled.Container>
  );
};

export default EventManager;

EventManager.propTypes = {
  isHomePage: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};
