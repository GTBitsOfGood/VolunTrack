import "flowbite-react";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import { getEvents } from "../../queries/events";
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

const EventManager = ({organizationId}) => {
  console.log(organizationId)
  const isHomePage = false
  const user = {
    role: "visitor"
  }

  const [loading, setLoading] = useState(true);
  const [filterOn, setFilterOn] = useState(false);
  const [dropdownVal, setDropdownVal] = useState("All Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);
  const [showBack, setShowBack] = useState(false);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const onRefresh = () => {
    setLoading(true);
    getEvents(organizationId).then((result) => {
      if (result?.data?.events) {
        setEvents(result.data.events);
        setFilteredEvents(result.data.events);
        setDates(result.data.events);
        setDropdownVal("All Events");
      }
      setLoading(false)
    });
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
    console.log('test')
    onRefresh()
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
        <div className="m-4 flex w-full flex-col md:w-4/6 md:px-16">
          <div className="flex flex-col lg:w-5/6">
              <div className="h-16" />
            {loading === true ? (
              <div className="mt-8">
                <Text text={"Loading..."} type="subheader" />
              </div>
            ) : (
              <div className="mt-8" />
            )}
            {filteredEvents.length === 0 && loading === false ? (
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
    </Styled.Container>
  );
};

export default EventManager;
