import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import styled from "styled-components";
import BoGButton from "../../components/BoGButton";
import EventCard from "../../components/EventCard";
import Text from "../../components/Text";
import Pagination from "../../components/PaginationComp";
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
  ul: styled.div`
    display: flex;
    flex-direction: column;
    list-style-type: none;
  `,
};

const EventsList = ({
  dateString,
  events,
  user,
  isHomePage,
  registrations,
  onCreateClicked,
}) => {
  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }

  events.sort(function (a, b) {
    const c = new Date(a.date);
    const d = new Date(b.date);
    return d - c;
  });

  let upcomingEvents = events.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) > currentDate;
  });

  const todayEvents = events.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) === currentDate;
  });

  const registeredEventIds = new Set(
    registrations.map((registration) => registration.eventId)
  );

  const registeredEvents = upcomingEvents.filter((event) => {
    return registeredEventIds.has(event.id);
  });

  const todayRegisteredEvents = registeredEvents.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) === currentDate;
  });

  const upcomingRegisteredEvents = registeredEvents.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) > currentDate;
  });

  // upcomingEvents = upcomingEvents.filter(function (event) {
  //   return !event.volunteers.includes(user._id);
  // });

  if (upcomingEvents.length > 5) {
    upcomingEvents = upcomingEvents.slice(0, 5);
  }

  if (registeredEvents.length > 2) {
    upcomingEvents = upcomingEvents.slice(0, 2);
  }

  const functions = {
    convertTime: convertTime,
  };

  const [currentPage, setCurrentPage] = useState(0);
  const onPageChange = () => {
    setCurrentPage(currentPage + 10);
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

  const updatePage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const past = () => {
    return pastDate;
  };

  if (!isHomePage) {
    return (
      <Styled.Container>
        {events.slice(currentPage * 10, (currentPage + 1) * 10).map((event) => (
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
              isRegistered={registeredEventIds.has(event.id)}
              private={event.isPrivate}
              dateDisplay={false}
            />
          </>
        ))}
        {events.length !== 0 && (
          <div className="column-flex self-center">
            <Text
              className="justify-content-center flex"
              text={`${currentPage * 10 + 1} - ${
                currentPage * 10 + 10 > events.length
                  ? events.length
                  : currentPage * 10 + 10
              } of total ${events.length} events`}
              type="helper"
            />
            <Pagination
              items={events}
              pageSize={10}
              currentPage={currentPage}
              updatePageCallback={updatePage}
            />
          </div>
        )}
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
                      isRegistered={true}
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
                      isRegistered={registeredEventIds.has(event.id)}
                      dateDisplay={true}
                    />
                  ))}
                </div>
              )}
              {registeredEvents.length === 0 && (
                <p className="justify-content-center mb-4 flex text-lg font-bold text-primaryColor">
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
                  dateDisplay={true}
                />
              ))}
            {upcomingEvents.length === 0 && (
              <p className="justify-content-center mb-4 flex text-lg font-bold text-primaryColor">
                No new events!
              </p>
            )}
            <Text text="View More" href="/events" />
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
                  dateDisplay={true}
                />
              ))}
            <div className="justify-content-center flex">
              {todayEvents.length === 0 && (
                <p className="font-weight-bold pb-3 text-lg text-primaryColor">
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
          <Text type="subheader" text="Nothing to Display." />
        </Styled.Container>
      );
    }
  }
};
EventsList.propTypes = {
  dateString: PropTypes.string,
  events: PropTypes.Array,
  user: PropTypes.object,
  isHomePage: PropTypes.bool,
  onCreateClicked: PropTypes.func,
};

export default EventsList;
