import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";
import EventCard from "../../components/EventCard";
import { useSession } from "next-auth/react";
import BoGButton from "../../components/BoGButton";
import Text from "../../components/Text";
import { Pagination } from "flowbite-react";
import { useState } from "react";

const Styled = {
  Container: styled.div`
    width: 48vw;
    @media (max-width: 768px) {
      width: 100%;
    }
    max-height: 100vh;
    min-height: min-content;
    overflow-y: auto;
  `,
  Spacer: styled.div`
    height: 12rem;
  `,
  Events: styled.div`
    text-align: left;
    font-size: 36px;
    font-weight: bold;
    width: 70%;
    @media (max-width: 768px) {
      font-size: 24px;
    }
  `,
  LinkedText: styled.p`
    color: #ef4e79;
    font-size: 0.9rem;
    font-weight: 900;
    text-align: left;
    text-decoration: underline;
    padding-top: 0.4rem;
    overflow-wrap: break-word;
    cursor: pointer;
  `,
  ul: styled.div`
    display: flex;
    flex-direction: column;
    list-style-type: none;
  `,
};

const convertTime = (time) => {
  let [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ["pm", "am", "PM", "AM"])) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};

// const monthMap = new Map([
//   ["Jan", "01"],
//   ["Feb", "02"],
//   ["Mar", "03"],
//   ["Apr", "04"],
//   ["May", "05"],
//   ["Jun", "06"],
//   ["Jul", "07"],
//   ["Aug", "08"],
//   ["Sep", "09"],
//   ["Oct", "10"],
//   ["Nov", "11"],
//   ["Dec", "12"],
// ]);

// const compareDateString = (dateNum) => {
//   let date = "";
//   let dateArr = dateNum.split(" ");
//   date = monthMap.get(dateArr[0]);
//   date += "/" + dateArr[1];
//   date += "/" + dateArr[2];
//   return date;
// };

const EventsList = ({
  dateString,
  events,
  onRegisterClicked,
  onUnregister,
  user,
  isHomePage,
  onCreateClicked,
}) => {
  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }

  events.sort(function (a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return d - c;
  });

  var upcomingEvents = events.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) > currentDate;
  });

  var todayEvents = events.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) === currentDate;
  });

  const registeredEvents = upcomingEvents.filter(function (event) {
    return event.volunteers.includes(user._id);
  });

  const todayRegisteredEvents = registeredEvents.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) === currentDate;
  });

  const upcomingRegisteredEvents = registeredEvents.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) > currentDate;
  });

  upcomingEvents = upcomingEvents.filter(function (event) {
    return !event.volunteers.includes(user._id);
  });

  if (upcomingEvents.length > 5) {
    upcomingEvents = upcomingEvents.slice(0, 5);
  }

  if (registeredEvents.length > 2) {
    upcomingEvents = upcomingEvents.slice(0, 2);
  }

  const functions = {
    convertTime: convertTime,
  };

  const [pageNum, setPageNum] = useState(1);
  const onPageChange = () => {
    setPageNum(pageNum + 10);
  };

  const formatDate = (date) => {
    const split = date.split(" ");
    return split[1] + " " + split[2] + ", " + split[3];
  };

  var pastDate = "";

  const updateDate = (event) => {
    const past = pastDate;
    pastDate = formatDate(new Date(event.date).toDateString());
    return past;
  };

  const past = () => {
    return pastDate;
  };

  if (!isHomePage) {
    return (
      <Styled.Container>
        {events.map((event) => (
          <>
            {updateDate(event) !==
            formatDate(new Date(event.date).toDateString()) ? (
              <Text
                type="subheader"
                className="m\y-2"
                text={formatDate(new Date(event.date).toDateString())}
              />
            ) : (
              <></>
            )}
            <EventCard
              key={event._id}
              event={event}
              user={user}
              functions={functions}
              onRegisterClicked={onRegisterClicked}
              private={event.isPrivate}
              dateDisplay={false}
            />
          </>
        ))}
        {/* <div className="flex items-center justify-center text-center">
          <Pagination
            currentPage={pageNum}
            layout="table"
            onPageChange={onPageChange}
            showIcons={true}
            totalPages={1000}
          />
        </div> */}
        <Styled.Spacer />
      </Styled.Container>
    );
  } else {
    if (user.role == "volunteer" && upcomingEvents.length > 0) {
      return (
        <Styled.Container>
          <Styled.ul>
            <div className="column-flex">
              <p className="font-weight-bold pb-3 text-2xl">
                Registered Events
              </p>
              {todayRegisteredEvents.length > 0 && (
                <div>
                  <p className="font-weight-bold pb-3 text-xl">
                    {"Today's Events"}
                  </p>
                  {todayRegisteredEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      user={user}
                      functions={functions}
                      onRegisterClicked={onRegisterClicked}
                      dateDisplay={true}
                    />
                  ))}
                </div>
              )}
              {upcomingRegisteredEvents.length > 0 && (
                <div>
                  <p className="font-weight-bold pb-3 text-xl">
                    {"Upcoming Events"}
                  </p>
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      user={user}
                      functions={functions}
                      onRegisterClicked={onRegisterClicked}
                      dateDisplay={true}
                    />
                  ))}
                </div>
              )}
              {registeredEvents.length === 0 && (
                <p className="justify-content-center text-primaryColor mb-4 flex text-lg font-bold">
                  Please register for an event!
                </p>
              )}
            </div>
          </Styled.ul>

          <Styled.ul>
            <p className="font-weight-bold pb-3 text-2xl">New Events</p>
            {upcomingEvents.length > 0 &&
              upcomingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  user={user}
                  functions={functions}
                  onRegisterClicked={onRegisterClicked}
                  dateDisplay={true}
                />
              ))}
            {upcomingEvents.length === 0 && (
              <p className="justify-content-center text-primaryColor mb-4 flex text-lg font-bold">
                No new events!
              </p>
            )}
            <Link href={`/events`}>
              <Styled.LinkedText>View More</Styled.LinkedText>
            </Link>
          </Styled.ul>
          <Styled.Spacer />
        </Styled.Container>
      );
    } else if (user.role === "admin") {
      return (
        <div className="w-3/5">
          <div>
            <p className="font-weight-bold pb-3 text-2xl">{"Today's Events"}</p>
            {todayEvents.length > 0 &&
              todayEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  user={user}
                  functions={functions}
                  onRegisterClicked={onRegisterClicked}
                  dateDisplay={true}
                />
              ))}
            <div className="justify-content-center flex">
              {todayEvents.length === 0 && (
                <p className="font-weight-bold text-primaryColor pb-3 text-lg">
                  No events scheduled today
                </p>
              )}
              <div className="h-24" />
            </div>
          </div>
          <div>
            <p className="font-weight-bold pb-3 text-2xl">Upcoming Events</p>
            {upcomingEvents.length > 0 && (
              <div>
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    functions={functions}
                    onRegisterClicked={onRegisterClicked}
                    version={"Secondary"}
                    dateDisplay={true}
                  />
                ))}
                <Text href={`/events`} text="View More" />
              </div>
            )}
            <div className="justify-content-center flex">
              {upcomingEvents.length === 0 && (
                <BoGButton text="Create new event" onClick={onCreateClicked} />
              )}
            </div>
            <div className="h-48" />
          </div>
        </div>
      );
    } else {
      return (
        <Styled.Container>
          <Styled.Events>Nothing to Display.</Styled.Events>
        </Styled.Container>
      );
    }
  }
};
EventsList.propTypes = {
  dateString: PropTypes.string,
  events: PropTypes.Array,
  onRegisterClicked: PropTypes.func,
  onUnregister: PropTypes.func,
  user: PropTypes.object,
  isHomePage: PropTypes.bool,
  onCreateClicked: PropTypes.func,
};

export default EventsList;
