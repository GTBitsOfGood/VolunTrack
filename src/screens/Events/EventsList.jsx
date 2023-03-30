/* eslint-disable prettier/prettier */
import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";
import EventCard from "../../components/EventCard";
import { useSession } from "next-auth/react";
import BoGButton from "../../components/BoGButton";
import Text from "../../components/Text";

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

  if (!isHomePage) {
    return (
      <Styled.Container>
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            user={user}
            functions={functions}
            onRegisterClicked={onRegisterClicked}
          />
        ))}
        <Styled.Spacer />
      </Styled.Container>
    );
  } else {
    if (registeredEvents.length > 0 && upcomingEvents.length > 0) {
      return (
        <Styled.Container>
          <Styled.ul>
            <Styled.Events>Registered Events</Styled.Events>
            {registeredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                user={user}
                functions={functions}
                onRegisterClicked={onRegisterClicked}
              />
            ))}
          </Styled.ul>

          <Styled.ul>
            <Styled.Events>New Events</Styled.Events>
            {upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                user={user}
                functions={functions}
                onRegisterClicked={onRegisterClicked}
              />
            ))}
            <Link href={`/events`}>
              <Styled.LinkedText>View More</Styled.LinkedText>
            </Link>
          </Styled.ul>
          <Styled.Spacer />
        </Styled.Container>
      );
    } else if (registeredEvents.length > 0) {
      return (
        <Styled.Container>
          <Styled.Events>Your Upcoming Events</Styled.Events>
          {registeredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              functions={functions}
              onRegisterClicked={onRegisterClicked}
            />
          ))}
          <Styled.Spacer />
        </Styled.Container>
      );
    } else if (user.role == "volunteer" && upcomingEvents.length > 0) {
      return (
        <Styled.Container>
          <p className="font-weight-bold pb-3 text-2xl">Upcoming Events</p>
          {upcomingEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              functions={functions}
              onRegisterClicked={onRegisterClicked}
            />
          ))}
          <Link href={`/events`}>
            <Styled.LinkedText>View More</Styled.LinkedText>
          </Link>
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
                />
              ))}
            <div className="justify-content-center flex">
              {todayEvents.length === 0 && (
                  <p className="font-weight-bold pb-3 text-lg text-primaryColor">No events scheduled today</p>
              )}
              <div className="h-24" />
            </div>
          </div>
          <div>
            <p className="font-weight-bold pb-3 text-2xl">Upcoming Events</p>
            {upcomingEvents.length > 0 &&
            <div>
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  user={user}
                  functions={functions}
                  onRegisterClicked={onRegisterClicked}
                  version={"Secondary"}
                />
              ))}
              <Text
                  href={`/events`}
                  text="View More"
              />
            </div>
            }
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
