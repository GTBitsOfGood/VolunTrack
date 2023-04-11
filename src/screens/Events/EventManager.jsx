// import { differenceInCalendarDays } from "date-fns";
import "flowbite-react";
import { Dropdown } from "flowbite-react";
import router from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import AdminHomeHeader from "../../components/AdminHomeHeader";
import BoGButton from "../../components/BoGButton";
import ProgressDisplay from "../../components/ProgressDisplay";
import variables from "../../design-tokens/_variables.module.scss";
import {
  getAttendances,
  getAttendanceStatistics,
} from "../../queries/attendances";
import { getEvent, getEvents } from "../../queries/events";
import { getRegistrations } from "../../queries/registrations";
import { filterAttendance } from "../Stats/helper";
import EventCreateModal from "./Admin/EventCreateModal";
import { updateEvent } from "./eventHelpers";
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
    width: 100%;
    height: 100%;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
    row-gap: 10px;
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
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterOn, setFilterOn] = useState(false);
  const [dropdownVal, setDropdownVal] = useState("All Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [eventState, setEventState] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const eventChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const attendChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const hourChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const onRefresh = () => {
    setLoading(true);
    getEvents(user.organizationId).then((result) => {
      if (result && result.data && result.data.events) {
        setEvents(result.data.events);
        setDates(result.data.events);
      }
      if (result?.data?.events) setNumEvents(result.data.events.length);

      // TODO: fix logic. We should use getEvents for the events, registrations, and attendance separately for hours
      getAttendanceStatistics(undefined, startDate, endDate).then(
        async (stats) => {
          let totalAttendance = 0;
          let totalHours = 0;
          for (const statistic of stats.data.statistics ?? []) {
            let event = {};
            try {
              event = (await getEvent(statistic._id)).data.event;
            } catch (e) {
              continue;
            }
            let split = event.date.split("-");
            let index = parseInt(split[1]) - 1;
            let stat = stats.data.statistics.find((s) => s._id === event._id);
            if (stat) {
              hourChart[index] += Math.round(stat.minutes / 60.0);
              attendChart[index] += stat.users.length;
              totalAttendance += stat.users.length;
              totalHours += stat.minutes / 60.0;
            }
            eventChart[index] = eventChart[index] + 1;
          }

          setAttend(totalAttendance);
          setHours(Math.round(totalHours * 100) / 100);
        }
      );
      eventState.push(eventChart);
      eventState.push(hourChart);
      eventState.push(attendChart);
    });
    getRegistrations(undefined, undefined, user._id)
      .then((result) => {
        if (result.data) {
          console.log(user);
          setRegistrations(result.data.registrations);
          console.log("registrations set");
        }
      })
      .finally(() => setLoading(false));
  };

  const onCreateClicked = () => {
    setShowCreateModal(true);
  };

  const toggleCreateModal = () => {
    setShowCreateModal((prev) => !prev);
    onRefresh();
  };
  useEffect(() => {
    getAttendances(undefined, undefined).then((result) => {
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

  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
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

  const changeValue = (label) => {
    setDropdownVal(label);
    const value = label;
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
                  : filterEvents(events, user)
              }
              user={user}
              registrations={registrations}
              isHomePage={isHomePage}
            />
          )}
          <EventCreateModal open={showCreateModal} toggle={toggleCreateModal} />
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
              user={user}
              registrations={registrations}
              isHomePage={isHomePage}
            />
          </div>
        </Styled.HomePage>
      )}

      {isHomePage && user.role !== "volunteer" && (
        <Styled.HomePage>
          <AdminHomeHeader
            events={events}
            dateString={dateString}
            numEvents={numEvents}
            attend={attend}
            hours={hours}
            eventChart={eventState}
            hourChart={hourChart}
            attendChart={attendChart}
          />
          <EventsList
            dateString={dateString}
            events={
              user.role === "admin"
                ? filterOn
                  ? filteredEvents
                  : events
                : filterEvents(events, user)
            }
            user={user}
            isHomePage={isHomePage}
            registrations={registrations}
            onCreateClicked={onCreateClicked}
          />
        </Styled.HomePage>
      )}
    </Styled.Container>
  );
};

export default EventManager;

EventManager.propTypes = {
  isHomePage: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};
