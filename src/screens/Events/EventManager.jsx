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
import AttendanceReminders from "../../components/AttendanceReminders";
import BoGButton from "../../components/BoGButton";
import ProgressDisplay from "../../components/ProgressDisplay";
import StatsTable from "../../components/StatsTable";
import { getAttendances } from "../../queries/attendances";
import {
  getEventFeed,
  getHomeSummary,
  localWallClock,
} from "../../queries/events";
import { getRegistrations } from "../../queries/registrations";
import { filterAttendance } from "../Stats/helper";
import EventCreateModal from "./Admin/EventCreateModal";
import EventsList from "./EventsList";
import Text from "../../components/Text";
import PaginationComp from "../../components/PaginationComp";
import LoadingModal from "./LoadingModal";
import EventResponseModal from "./Admin/EventResponseModal";
import ShiftWeekPanel from "../ShiftCalendar/ShiftWeekPanel";

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
      flex: 1 1 auto;
      min-width: 0;
      width: auto;
      align-items: stretch;
      margin-left: 1rem;
      margin-right: 1rem;
    }
  `,
  Calendar: styled(Calendar)`
    /* Phones and tablets: the full column. Laptops (1024px and up): beside
       the list, never narrower than 280px so the weekday names fit. */
    max-width: 100%;
    @media (min-width: 1024px) {
      max-width: max(22vw, 280px);
    }
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
  const [dropdownVal, setDropdownVal] = useState("Upcoming Events");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseIsError, setResponseIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Days that have shifts ("YYYY-MM-DD"), for the calendar dots.
  const [calendarDays, setCalendarDays] = useState(new Set());
  const [showBack, setShowBack] = useState(false);

  // Only the shifts on screen: one page of the Events list, or the Home lists.
  // (The page used to download every shift, sign-up and attendance record.)
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [listQuery, setListQuery] = useState({ view: "upcoming" });
  const [homeSummary, setHomeSummary] = useState(null);
  // Bumped after a create, edit or delete so the week box reloads too.
  const [weekBoxVersion, setWeekBoxVersion] = useState(0);
  const refreshWeekBox = () => setWeekBoxVersion((version) => version + 1);
  // The signed-in person's own sign-ups and attendance records.
  const [registrations, setRegistrations] = useState([]);
  const [myAttendances, setMyAttendances] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [isEmptyDates, setIsEmptyDates] = useState(false);
  const [isInvalidRange, setIsInvalidRange] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination
  const pageSize = 3; // Number of events per page

  // Member History on the volunteer Home page, narrowed by the From/To search.
  const attendances = useMemo(
    () => filterAttendance(myAttendances, startDate, endDate),
    [myAttendances, startDate, endDate]
  );

  // Loads one page of the Events list. quiet keeps the current list on screen
  // while it loads (after an edit, so its "saved" message stays visible).
  const loadList = (query, page, { quiet = false, withDates = false } = {}) => {
    if (!quiet) setLoading(true);
    return getEventFeed({ ...query, page, pageSize, dates: withDates })
      .then((result) => {
        if (result?.data?.events) {
          const total = result.data.total ?? 0;
          const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
          if (page > lastPage)
            return loadList(query, lastPage, { quiet: true, withDates });
          setEvents(result.data.events);
          setTotalEvents(total);
          setCurrentPage(page);
          if (result.data.dates) setCalendarDays(new Set(result.data.dates));
        } else if (result?.error) {
          console.error("Error getting events:", result.error);
        }
      })
      .catch((error) => {
        console.error("An interval server error occured", error);
      })
      .finally(() => {
        if (!quiet) setLoading(false);
      });
  };

  const loadHome = () =>
    Promise.all([
      getEventFeed({ view: "home" }).then((result) => {
        if (result?.data?.events) setEvents(result.data.events);
        else if (result?.error)
          console.error("Error getting events:", result.error);
      }),
      user.role !== "volunteer" &&
        getHomeSummary().then((result) => {
          if (result?.data && !result.error) setHomeSummary(result.data);
          else if (result?.error)
            console.error("Error getting the overview:", result.error);
        }),
    ]);

  const onRefresh = () => {
    setLoading(true);
    const work = [];
    if (isHomePage) {
      work.push(loadHome());
    } else {
      const upcoming = { view: "upcoming" };
      setDropdownVal("Upcoming Events");
      setListQuery(upcoming);
      work.push(loadList(upcoming, 0, { quiet: true, withDates: true }));
    }
    if (user.role !== "admin")
      work.push(
        getRegistrations({
          organizationId: user.organizationId,
          userId: user._id,
        }).then((result) => {
          if (result?.data?.registrations)
            setRegistrations(result.data.registrations);
        })
      );
    if (isHomePage && user.role === "volunteer")
      work.push(
        getAttendances({
          organizationId: user.organizationId,
          userId: user._id,
        }).then((result) => {
          if (result?.data?.attendances)
            setMyAttendances(result.data.attendances);
        })
      );
    Promise.all(work)
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateClicked = () => {
    setShowCreateModal(false);
    setShowCreateModal(true);
  };

  const onSubmitValues = (values, setSubmitting) => {
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
      start = values.startDate;
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      end = values.endDate;
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
    refreshWeekBox();
  };

  const toggleResponseModal = () => {
    setShowResponseModal((prev) => !prev);
    onRefresh();
    refreshWeekBox();
  };
  useEffect(() => {
    onRefresh();
  }, []);

  let splitDate = selectedDate.toDateString().split(" ");
  const [dateString, setDateString] = useState(
    splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]
  );

  const formatJsDate = (jsDate, separator = "/") => {
    return [
      String(jsDate.getFullYear()).padStart(4, "0"),
      String(jsDate.getMonth() + 1).padStart(2, "0"),
      String(jsDate.getDate()).padStart(2, "0"),
    ].join(separator);
  };

  // A calendar day: the shifts on that day, one page at a time.
  const onChange = (value) => {
    setShowBack(true);
    setSelectedDate(value);
    let splitDate = value.toDateString().split(" ");
    setDateString(splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]);
    const query = { view: "day", day: formatJsDate(value, "-") };
    setListQuery(query);
    loadList(query, 0);
  };

  const setMarkDates = ({ date }) => {
    let tileClassName = calendarDays.has(formatJsDate(date, "-"))
      ? "marked"
      : "";
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
    setSelectedDate(currentDate);
    let splitDate = currentDate.toDateString().split(" ");
    let date = splitDate[1] + " " + splitDate[2] + ", " + splitDate[3];
    setDateString(date);
    setShowBack(false);
    onRefresh();
  };

  const VIEW_FOR_LABEL = {
    "This Month": "month",
    "Upcoming Events": "upcoming",
    "All Events": "all",
    "Public Events": "public",
    "Private Group Events": "private",
  };

  const changeValue = (label) => {
    setDropdownVal(label);
    const query = {
      view: VIEW_FOR_LABEL[label] ?? "upcoming",
      ...(label === "This Month"
        ? { month: localWallClock().slice(0, 7) }
        : {}),
    };
    setListQuery(query);
    loadList(query, 0);
  };

  // After a shift is edited or deleted, reload what is on screen from the server.
  const reloadAfterChange = () => {
    refreshWeekBox();
    if (isHomePage) loadHome();
    else loadList(listQuery, currentPage, { quiet: true, withDates: true });
  };
  const onEventDelete = () => reloadAfterChange();
  const onEventEdit = () => reloadAfterChange();

  return (
    <Styled.Container>
      {!isHomePage && (
        <div className="flex w-full max-lg:flex-wrap">
          <div className="m-4 flex-col max-lg:w-[calc(100%-2rem)] lg:flex lg:w-2/6 lg:pl-16">
            <div className="my-1 ml-2 flex flex-col items-start">
              <Text text="Events" type="header" />
            </div>
            <div className="flex justify-center rounded-md p-2 max-lg:mx-auto max-lg:w-full max-lg:max-w-md lg:w-fit">
              <Styled.Calendar
                className="bg-white"
                onChange={onChange}
                value={selectedDate}
                tileClassName={({ date }) => setMarkDates({ date })}
                navigationLabel={({ date }) => {
                  return new Intl.DateTimeFormat("en-US", {
                    month: "long",
                  }).format(date);
                }}
                locale="en-US"
              />
            </div>
            {user.role === "admin" && (
              <ShiftWeekPanel
                selectedDate={selectedDate}
                refreshKey={weekBoxVersion}
              />
            )}
          </div>
          <div className="m-4 flex min-w-0 flex-col overflow-hidden max-lg:w-[calc(100%-2rem)] lg:w-4/6 lg:px-16">
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
                {!loading && events.length === 0 && (
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
                {!loading && events.length > 0 && (
                  <EventsList
                    dateString={dateString}
                    events={events}
                    registrations={registrations}
                    user={user}
                    isHomePage={isHomePage}
                    onEventDelete={onEventDelete}
                    onEventEdit={onEventEdit}
                  />
                )}
                <PaginationComp
                  items={events}
                  totalItems={totalEvents}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  updatePageCallback={(page) => loadList(listQuery, page)}
                />
              </div>
              {showCreateModal && (
                <EventCreateModal
                  open={showCreateModal}
                  toggle={toggleCreateModal}
                  toggleResponseModal={toggleResponseModal}
                  setResponseIsError={setResponseIsError}
                  setErrorMsg={setErrorMsg}
                />
              )}
              {showResponseModal && (
                <EventResponseModal
                  open={showResponseModal}
                  toggle={toggleResponseModal}
                  isError={responseIsError}
                  errorMsg={errorMsg}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {isHomePage && user.role === "volunteer" && (
        <Styled.HomePage>
          <h2 className="text-bold w-full text-left font-bold">
            My Membership
          </h2>
          <div className="flex w-full flex-col gap-8 lg:flex-row">
            <div className="mb-4 min-w-0 justify-start">
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
                      label="From (Atlanta time)"
                      name="startDate"
                      type="datetime-local"
                      isEmptyOrInvalid={isEmptyDates || isInvalidRange}
                    />
                    <InputField
                      label="To (Atlanta time)"
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
                <Text text="Member History" type="subheader" />
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
              events={events}
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
            attendanceReminders={
              user.role === "admin" ? (
                <AttendanceReminders
                  key={`${user._id}:${user.organizationId}`}
                />
              ) : null
            }
            summary={homeSummary}
          />
          <EventsList
            dateString={dateString}
            events={events}
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
