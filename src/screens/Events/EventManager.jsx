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
import { getAttendances } from "../../queries/attendances";
import { getEvents } from "../../queries/events";
import { getRegistrations } from "../../queries/registrations";
import EventCreateModal from "./Admin/EventCreateModal";
import EventsList from "./EventsList";
import Text from "../../components/Text";

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
        setFilteredEvents(result.data.events);
        setDates(result.data.events);
        setDropdownVal("All Events");
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
          setFilteredEvents(result.data.events);
          setDropdownVal("All Events");
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
    let dates = [];
    for (let i = 0; i < markDates.length; i++) {
      if (user.role === "admin") {
        dates.push(markDates[i].date.slice(0, 10));
      } else if (!markDates[i].eventParent.isPrivate) {
        dates.push(markDates[i].date.slice(0, 10));
      }
    }
    if (dates.includes(fDate)) {
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
    setFilteredEvents(filteredEvents.filter((event) => event._id !== id));
  };

  return (
    <Styled.Container>
      {!isHomePage && (
        <div className="m-4 hidden w-2/6 flex-col md:flex lg:pl-16">
          <div className="my-1 ml-2 flex flex-col items-start">
            <Text text="Events" type="header" />
          </div>
          <div className="m-2 w-fit rounded-md bg-gray-50 p-2">
            <Calendar
              className="bg-white"
              onChange={onChange}
              value={selectedDate}
              tileClassName={({ date, view }) =>
                setMarkDates({ date, view }, markDates)
              }
            />
          </div>
          <Text text="How to read the calendar?" type="subheader" />
          <img
            className="h-48"
            src="/images/Calendar Legend.svg"
            alt="legend"
          />
        </div>
      )}
      {!isHomePage && (
        <div className="m-4 flex w-full flex-col md:w-4/6 md:px-16">
          <div className="flex flex-col lg:w-5/6">
            {user.role === "admin" ? (
              <div className="mb-4 flex w-full items-center justify-between ">
                <Dropdown
                  inline={true}
                  arrowIcon={false}
                  label={<BoGButton text={dropdownVal} dropdown={true} />}
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
                <BoGButton text="Create event" onClick={onCreateClicked} />
              </div>
            ) : (
              <div className="h-16" />
            )}
            {filteredEvents.length === 0 ? (
              <div className="mt-8">
                <Text
                  text={"No Events Scheduled on " + dateString}
                  type="subheader"
                />
                {showBack && (
                  <button
                    className="text-primaryColor hover:underline"
                    onClick={setDateBack}
                  >
                    Show Events for all Dates
                  </button>
                )}
              </div>
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
                registrations={registrations}
                user={user}
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
          </div>
        </div>
      )}
      {isHomePage && user.role === "volunteer" && (
        <Styled.HomePage>
          <div className="flex-column flex">
            <div className="mb-4 justify-start">
              <p className="mb-2 text-2xl font-bold">Accomplishments</p>
              <div className="mx-auto flex flex-wrap space-y-1 md:space-x-1 md:space-y-0">
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
