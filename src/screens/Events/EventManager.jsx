// import { differenceInCalendarDays } from "date-fns";
import "flowbite-react";
import { Dropdown } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import AdminHomeHeader from "../../components/AdminHomeHeader";
import BoGButton from "../../components/BoGButton";
import ProgressDisplay from "../../components/ProgressDisplay";
import variables from "../../design-tokens/_variables.module.scss";
import { getAttendances } from "../../queries/attendances";
import { getEvent, getEvents } from "../../queries/events";
import { getRegistrations } from "../../queries/registrations";
import { filterAttendance } from "../Stats/helper";
import EventCreateModal from "./Admin/EventCreateModal";
import EventsList from "./EventsList";

// const isSameDay = (a) => (b) => {
//   return differenceInCalendarDays(a, b) === 0;
// };

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    padding-y: 2rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow: hidden;
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
    height: 100%;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
    row-gap: 10px;

    @media (max-width: 768px) {
      width: 100%;
      margin-left: 1rem;
      margin-right: 1rem;
    }
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

const EventManager = ({ isHomePage }) => {
  const { data: session } = useSession();
  const user = session.user;

  const [loading, setLoading] = useState(true);
  const [filterOn, setFilterOn] = useState(false);
  const [dropdownVal, setDropdownVal] = useState("All Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);
  const [showBack, setShowBack] = useState(false);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendances, setAttendances] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onRefresh = () => {
    setLoading(true);
    getEvents(user.organizationId).then((result) => {
      if (result?.data?.events) {
        setEvents(result.data.events);
        setDates(result.data.events);
      }
    });

    let filter = { organizationId: user.organizationId };
    if (user.role === "volunteer")
      filter = { organizationId: user.organizationId, userId: user._id };

    getRegistrations(filter)
      .then((result) => {
        if (result.data.registrations)
          setRegistrations(result.data.registrations);
      })
      .finally(() => setLoading(false));
  };

  const onCreateClicked = () => {
    setShowCreateModal(false);
    setShowCreateModal(true);
  };

  const toggleCreateModal = () => {
    setShowCreateModal((prev) => !prev);
    onRefresh();
  };
  useEffect(() => {
    let query = { organizationId: user.organizationId };
    if (user.role === "volunteer") query.userId = user._id;

    getAttendances(query).then((result) => {
      if (result?.data?.attendances) {
        setAttendances(result.data.attendances);
      }
    });
    onRefresh();
  }, []);

  let splitDate = selectedDate.toDateString().split(" ");
  const [dateString, setDateString] = useState(
    splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]
  );

  const onChange = (value) => {
    if (Date.now() !== value) setShowBack(true);
    setSelectedDate(value);
    let datestr = value.toString();
    let splitDate = value.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
    let selectDate = new Date(datestr).toISOString().split("T")[0];

    setLoading(true);
    getEvents(user.organizationId, selectDate, selectDate)
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
    setSelectedDate(currentDate);
    let splitDate = currentDate.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
    setShowBack(false);
    onRefresh();
  };

  const filterEventsForVolunteers = (events, user) => {
    let arr = [];
    for (let i = 0; i < events.length; i++) {
      if (
        // hide past events and private events they are not registered for
        new Date(events[i].date) >= new Date(Date.now() - 2 * 86400000) &&
        (!events[i].eventParent.isPrivate ||
          registrations.filter(
            (r) => r.eventId === events[i]._id && r.userId === user._id
          ).length > 0)
      ) {
        arr.push(events[i]);
      }
    }
    return arr;
  };

  const changeValue = (label) => {
    setDropdownVal(label);
    const value = label;
    if (value === "Public Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => !event.eventParent.isPrivate));
    } else if (value === "Private Group Events") {
      setFilterOn(true);
      setFilteredEvents(events.filter((event) => event.eventParent.isPrivate));
    } else if (value === "All Events") {
      setFilterOn(false);
    }
  };

  const onEventDelete = (id) => {
    setEvents(events.filter((event) => event._id !== id));
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
          <div className="m-2 rounded-md bg-gray-50 p-2">
            <Calendar
              className="bg-white"
              onChange={onChange}
              value={selectedDate}
              tileClassName={({ date, view }) =>
                setMarkDates({ date, view }, markDates)
              }
            />
          </div>
          <Styled.LegendText>How to read the calendar?</Styled.LegendText>
          <Styled.LegendImage src="/images/Calendar Legend.svg" alt="legend" />
        </Styled.Left>
      )}
      {!isHomePage && (
        <Styled.Right>
          {user.role === "admin" ? (
            <div className="my-4 flex w-full items-center justify-between">
              <Dropdown
                inline={true}
                arrowIcon={false}
                label={<BoGButton text="Filter Events" dropdown={true} />}
              >
                <Dropdown.Item
                  onClick={() => {
                    changeValue("All Events");
                  }}
                >
                  All Events
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    changeValue("Public Events");
                  }}
                >
                  Public Events
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    changeValue("Private Group Events");
                  }}
                >
                  Private Group Events
                </Dropdown.Item>
              </Dropdown>
              <BoGButton text="Create new event" onClick={onCreateClicked} />
            </div>
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
                  : filterEventsForVolunteers(events, user)
              }
              user={user}
              registrations={registrations}
              isHomePage={isHomePage}
              onEventDelete={onEventDelete}
            />
          )}
          {showCreateModal && (
            <EventCreateModal
              open={showCreateModal}
              toggle={toggleCreateModal}
            />
          )}
        </Styled.Right>
      )}
      {isHomePage && user.role === "volunteer" && (
        <Styled.HomePage>
          <div className="flex-column flex">
            <div className="mb-4 justify-start">
              <p className="mb-2 text-2xl font-bold">Accomplishments</p>
              <div className="mx-auto flex flex-wrap">
                <ProgressDisplay
                  type={"Events"}
                  attendance={attendances}
                  header={"Events Attended"}
                  medalDefaults={session.medalDefaults}
                />
                <ProgressDisplay
                  type={"Hours"}
                  attendance={attendances}
                  header={"Hours Earned"}
                  medalDefaults={session.medalDefaults}
                />
              </div>
            </div>
            <EventsList
              dateString={dateString}
              events={
                user.role === "admin"
                  ? filteredEvents
                  : filterEventsForVolunteers(events, user)
              }
              user={user}
              registrations={registrations}
              isHomePage={isHomePage}
              onEventDelete={onEventDelete}
            />
          </div>
        </Styled.HomePage>
      )}

      {isHomePage && user.role !== "volunteer" && (
        <Styled.HomePage>
          <AdminHomeHeader
            events={events}
            attendances={attendances}
            registrations={registrations}
            dateString={dateString}
          />
          <EventsList
            dateString={dateString}
            events={
              user.role === "admin"
                ? filterOn
                  ? filteredEvents
                  : events
                : filterEventsForVolunteers(events, user)
            }
            user={user}
            isHomePage={isHomePage}
            registrations={registrations}
            onCreateClicked={onCreateClicked}
            onEventDelete={onEventDelete}
          />
        </Styled.HomePage>
      )}
    </Styled.Container>
  );
};

export default EventManager;

EventManager.propTypes = {
  user: PropTypes.object.isRequired,
};
