import "flowbite-react";
import { Formik } from "formik";
import InputField from "../../components/Forms/InputField";
import { Dropdown } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import AdminHomeHeader from "../../components/AdminHomeHeader";
import BoGButton from "../../components/BoGButton";
import ProgressDisplay from "../../components/ProgressDisplay";
import StatsTable from "../../components/StatsTable";
import { getAttendances } from "../../queries/attendances";
import { getEvents } from "../../queries/events";
import { getRegistrations } from "../../queries/registrations";
import { filterAttendance } from "../Stats/helper";
import EventCreateModal from "./Admin/EventCreateModal";
import EventsList from "./EventsList";
import Text from "../../components/Text";
import PaginationComp from "./EventPagination";
import LoadingModal from "./LoadingModal";

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
  Calendar: styled(Calendar)`
    max-width: 22vw;
    border: none;
    .react-calendar__navigation {
      border-bottom: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 2.5em;
    }
    .react-calendar__navigation__label {
      order: 2;
    }
    .react-calendar__navigation__prev-button {
      order: 1;
    }
    .react-calendar__navigation__next-button {
      order: 3;
    }
    .react-calendar__navigation__prev2-button,
    .react-calendar__navigation__next2-button {
      display: none;
    }
    .react-calendar__navigation__prev-button,
    .react-calendar__navigation__next-button {
      font-size: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding-bottom: 0.2em;
    }
    .react-calendar__month-view__weekdays__weekday {
      font-weight: normal;
      text-decoration: none;
      color: darkgrey;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
    }
    &.bg-white {
      border: none;
      .react-calendar__month-view__days__day--neighboringMonth {
        color: #757575 !important;
      }
      .react-calendar__month-view__days__day--weekend:not(
          .react-calendar__month-view__days__day--neighboringMonth
        ) {
        color: black !important;
      }
      .react-calendar__tile {
        aspect-ratio: 1/1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 !important;
        font-size: 1em;
      }
      .react-calendar__tile--now,
      .react-calendar__tile--active,
      .react-calendar__tile:hover {
        background: var(--primary-color) !important;
        color: white !important;
        border-radius: 50%;
        padding: 5% !important;
        box-sizing: border-box;
        &.marked::after {
          background: white;
        }
      }
      .react-calendar__tile--now {
        background: var(--primary-color) !important;
      }
      .react-calendar__tile--active {
        background: var(--secondary-color) !important;
      }
      .react-calendar__tile:hover {
        background: var(--hover-color) !important;
      }
      .marked {
        position: relative;
      }
      .marked::after {
        content: "";
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 5px;
        height: 5px;
        background: var(--primary-color);
        border-radius: 50%;
      }
    }
    .react-calendar__year-view__months__month.react-calendar__tile--hasActive {
      background: var(--secondary-color) !important;
      color: white !important;
      border-radius: 50%;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5% !important;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      &.bg-white .react-calendar__tile {
        font-size: 0.9em;
      }
    }
    @media (max-width: 480px) {
      &.bg-white .react-calendar__tile {
        font-size: 0.8em;
      }
    }
  `,
};

const EventManager = ({ isHomePage }) => {
  const { data: session } = useSession();
  const user = session.user;

  const [loading, setLoading] = useState(true);
  // const [filterOn, setFilterOn] = useState(false);
  const [dropdownVal, setDropdownVal] = useState("Upcoming Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [markDates, setDates] = useState([]);
  const [showBack, setShowBack] = useState(false);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendances, setAttendances] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [isEmptyDates, setIsEmptyDates] = useState(false);
  const [isInvalidRange, setIsInvalidRange] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const pageSize = 3; // Number of events per page

  const onRefresh = () => {
    setLoading(true);
    const eventsPromise = getEvents(user.organizationId)
      .then((result) => {
        if (result?.data?.events) {
          const fetchedEvents = result.data.events;
          setEvents(result.data.events);
          setFilteredEvents(
            fetchedEvents.filter((event) => {
              let currentDate = new Date();
              let utcNow = new Date(
                Date.UTC(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  currentDate.getHours(),
                  currentDate.getMinutes()
                )
              );
              let eventDate = new Date(event.date);
              const [hours, minutes] = event.eventParent.endTime
                .split(":")
                .map(Number);
              eventDate.setUTCHours(hours, minutes);

              return eventDate >= utcNow;
            })
          );
          setDates(result.data.events);
          setDropdownVal("Upcoming Events");
        } else if (result?.error) {
          console.error("Error getting events:", result.error);
        }
      })
      .catch((error) => {
        console.error("An interval server error occured", error);
      });

    let filter = { organizationId: user.organizationId };
    if (user.role === "volunteer")
      filter = { organizationId: user.organizationId, userId: user._id };

    const registrationsPromise = getRegistrations(filter).then((result) => {
      if (result?.data?.registrations) {
        const registrations = result.data.registrations;
        setRegistrations(registrations);
      }
    });

    let query = { organizationId: user.organizationId };
    if (user.role === "volunteer") query.userId = user._id;

    const attendancePromise = getAttendances(query).then((result) => {
      if (result?.data?.attendances) {
        const filteredAttendance = filterAttendance(
          result.data.attendances,
          startDate,
          endDate
        );
        setAttendances(filteredAttendance);
      }
    });

    Promise.all([eventsPromise, registrationsPromise, attendancePromise])
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    setCurrentPage(0); // Reset to the first page when events are fetched
  };

  const onCreateClicked = () => {
    setShowCreateModal(false);
    setShowCreateModal(true);
  };

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();

    if (!values.startDate && !values.endDate) {
      setIsEmptyDates(true);
    } else {
      setIsEmptyDates(false);
    }

    let start = null;
    let end = null;

    if (!values.startDate) {
      setStartDate("undefined");
    } else {
      start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }

    if (start && end) {
      if (end < start) {
        setIsInvalidRange(true);
      } else {
        setIsInvalidRange(false);
      }
    } else {
      setIsInvalidRange(false);
    }
  };

  const toggleCreateModal = () => {
    setShowCreateModal((prev) => !prev);
    onRefresh();
  };
  useEffect(() => {
    onRefresh();
  }, []);

  const paginatedEvents = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage, pageSize]);

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
          // setEvents(result.data.events);
          setFilteredEvents(result.data.events);
          // setDropdownVal("All Events");
        } else if (result?.error) {
          console.error("Error getting events:", result.error);
        }
      })
      .catch((error) => {
        console.error("An interval server error occured", error);
      })
      .finally(() => {
        setLoading(false);
      });
    setCurrentPage(0); // Reset to the first page when date changes
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
    // Check if the date is a weekend (Saturday = 6, Sunday = 0)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      tileClassName = tileClassName
        ? `${tileClassName} weekend-no-red`
        : "weekend-no-red";
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
        // hide private events they are not registered for
        // new Date(events[i].date) >= new Date(Date.now() - 2 * 86400000) &&
        !events[i].eventParent.isPrivate ||
        registrations.filter(
          (r) => r.eventId === events[i]._id && r.userId === user._id
        ).length > 0
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
      setFilteredEvents(events.filter((event) => !event.eventParent.isPrivate));
    } else if (value === "Private Group Events") {
      setFilteredEvents(events.filter((event) => event.eventParent.isPrivate));
    } else if (value === "All Events") {
      setFilteredEvents(
        events.filter(
          (event) => !event.eventParent.isPrivate || event.eventParent.isPrivate
        )
      );
    } else if (value === "This Month") {
      setFilteredEvents(
        events.filter((event) => {
          let eventDate = new Date(event.date);
          let currentDate = new Date(Date.now());
          return (
            eventDate.getMonth() == currentDate.getMonth() &&
            eventDate.getFullYear() == currentDate.getFullYear()
          );
        })
      );
    } else if (value === "Upcoming Events") {
      setFilteredEvents(
        events.filter((event) => {
          let currentDate = new Date();
          let utcNow = new Date(
            Date.UTC(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              currentDate.getHours(),
              currentDate.getMinutes()
            )
          );
          let eventDate = new Date(event.date);
          const [hours, minutes] = event.eventParent.endTime
            .split(":")
            .map(Number);
          eventDate.setUTCHours(hours, minutes);

          return eventDate >= utcNow;
        })
      );
    }
    setCurrentPage(0); // Reset to the first page when filter changes
  };

  const onEventDelete = (id, recurringEvent) => {
    if (recurringEvent) {
      const eventParentId = events.find((event) => event._id === id).eventParent
        ._id;
      const eventDate = events.find((event) => event._id === id).date;
      setEvents(
        events.filter(
          (event) =>
            event.eventParent._id !== eventParentId || event.date < eventDate
        )
      );
      setFilteredEvents(
        filteredEvents.filter(
          (event) =>
            event.eventParent._id !== eventParentId || event.date < eventDate
        )
      );
    } else {
      setEvents(events.filter((event) => event._id !== id));
      setFilteredEvents(filteredEvents.filter((event) => event._id !== id));
    }
  };

  const onEventEdit = (id, eventParentId, recurringEvent) => {
    if (recurringEvent) {
      const eventDate = events.find((event) => event._id === id).date;
      setEvents(
        events.map((event) => {
          if (
            event.eventParent._id === eventParentId &&
            event.date >= eventDate
          ) {
            event.eventParent = events.find(
              (event) => event._id === id
            ).eventParent;
          }
          return event;
        })
      );
    } else {
      events.find((event) => event._id === id).recurringEvents = 0;
    }

    // Update recurring event counts
    let parentIdFilteredEvents = events.filter(
      (event) => event.eventParent._id === eventParentId
    );
    let recurringEventCount = 0;
    // This works without updating the original events because the obejcts are passed by reference... :)
    for (let i = parentIdFilteredEvents.length - 1; i >= 0; --i)
      parentIdFilteredEvents[i].recurringEvents = recurringEventCount++;
  };

  return (
    <Styled.Container>
      {!isHomePage && (
        <div className="flex w-full max-md:flex-wrap">
          <div className="m-4 flex-col max-md:w-[80vw] md:flex md:w-2/6 lg:pl-16">
            <div className="my-1 ml-2 flex flex-col items-start">
              <Text text="Events" type="header" />
            </div>
            <div className="flex justify-center rounded-md p-2 max-md:w-[85vw] md:w-fit">
              <Styled.Calendar
                className="bg-white"
                onChange={onChange}
                value={selectedDate}
                tileClassName={({ date, view }) =>
                  setMarkDates({ date, view }, markDates)
                }
                navigationLabel={({ date }) => {
                  return new Intl.DateTimeFormat("en-US", {
                    month: "long",
                  }).format(date);
                }}
                locale="en-US"
              />
            </div>
          </div>
          <div className="m-4 flex flex-col overflow-hidden max-md:w-[90vw] md:w-4/6 md:w-full md:px-16">
            <div className="flex flex-col lg:w-5/6">
              <div className="flex w-full items-center justify-between ">
                <Dropdown
                  inline={true}
                  arrowIcon={false}
                  label={<BoGButton text={dropdownVal} dropdown={true} />}
                >
                  <Dropdown.Item
                    onClick={() => {
                      changeValue("This Month");
                    }}
                  >
                    This Month
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      changeValue("Upcoming Events");
                    }}
                  >
                    Upcoming Events
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      changeValue("All Events");
                    }}
                  >
                    All Events
                  </Dropdown.Item>
                  {user.role === "admin" && (
                    <Dropdown.Item
                      onClick={() => {
                        changeValue("Public Events");
                      }}
                    >
                      Public Events
                    </Dropdown.Item>
                  )}
                  {user.role === "admin" && (
                    <Dropdown.Item
                      onClick={() => {
                        changeValue("Private Group Events");
                      }}
                    >
                      Private Group Events
                    </Dropdown.Item>
                  )}
                </Dropdown>
                {user.role === "admin" && (
                  <BoGButton text="Create event" onClick={onCreateClicked} />
                )}
              </div>
              <div className="mt-8">
                {loading && (
                  <div className="flex justify-center">
                    <LoadingModal isOpen={loading} />
                  </div>
                )}
                {!loading && paginatedEvents.length === 0 && (
                  <div>
                    <Text
                      text="No Events Scheduled for Filter"
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
                )}
                {!loading && paginatedEvents.length > 0 && (
                  <EventsList
                    dateString={dateString}
                    events={
                      user.role === "admin"
                        ? paginatedEvents
                        : filterEventsForVolunteers(paginatedEvents, user)
                    }
                    registrations={registrations}
                    user={user}
                    isHomePage={isHomePage}
                    onEventDelete={onEventDelete}
                    onEventEdit={onEventEdit}
                  />
                )}
                <PaginationComp
                  items={filteredEvents}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  updatePageCallback={setCurrentPage}
                />
              </div>
              {showCreateModal && (
                <EventCreateModal
                  open={showCreateModal}
                  toggle={toggleCreateModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {isHomePage && user.role === "volunteer" && (
        <Styled.HomePage>
          <h2 className="text-bold w-full text-left font-bold">
            My Volunteering
          </h2>
          <div className="flex flex-row gap-8">
            <div className="mb-4 justify-start">
              <div className="mx-auto flex flex-wrap gap-3">
                <ProgressDisplay
                  type="Events"
                  className="mb-1 mr-1"
                  attendance={attendances}
                  header="Events Attended"
                  medalDefaults={session.medalDefaults}
                />
                <ProgressDisplay
                  className="mb-1 mr-1 sm:mr-0"
                  type="Hours"
                  attendance={attendances}
                  header="Hours Earned"
                  medalDefaults={session.medalDefaults}
                />
              </div>
              <Formik
                initialValues={{}}
                onSubmit={(values, { setSubmitting }) => {
                  onSubmitValues(values, setSubmitting);
                }}
                render={({ handleSubmit }) => (
                  <div className="my-2 flex w-full flex-col py-4 md:w-auto md:flex-row md:items-end md:space-x-4">
                    <InputField
                      label="From"
                      name="startDate"
                      type="datetime-local"
                      isEmptyOrInvalid={isEmptyDates || isInvalidRange}
                    />
                    <InputField
                      label="To"
                      name="endDate"
                      type="datetime-local"
                      isEmptyOrInvalid={isEmptyDates || isInvalidRange}
                    />
                    <BoGButton
                      className="my-3 w-full bg-primaryColor hover:bg-hoverColor"
                      text="Search"
                      onClick={() => {
                        handleSubmit();
                      }}
                    />
                  </div>
                )}
              />
              <div className="w-full">
                <Text text="Volunteer History" type="subheader" />
                <Text
                  text={`${attendances.length} events`}
                  className="my-2 text-primaryColor"
                />
                <StatsTable
                  attendances={attendances}
                  isIndividualStats={true}
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
              showNewEvents={false}
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
                ? events
                : filterEventsForVolunteers(events, user)
            }
            user={user}
            isHomePage={isHomePage}
            registrations={registrations}
            onCreateClicked={onCreateClicked}
            onEventDelete={onEventDelete}
            onEventEdit={onEventEdit}
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
