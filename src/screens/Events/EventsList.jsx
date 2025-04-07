import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EventCard from "../../components/EventCard";
import Text from "../../components/Text";
import { useState, useEffect } from "react";
import { Alert } from "flowbite-react";
import LoadingModal from "./LoadingModal";

const Styled = {
  Container: styled.div`
    max-height: 60vh;
    overflow-y: auto;
  `,
  HomeContainer: styled.div`
    max-height: 100vh;
    min-height: min-content;
    overflow-y: auto;
  `,
};

const EventsList = ({
  dateString,
  events,
  user,
  isHomePage,
  registrations,
  onCreateClicked,
  onEventDelete,
  onEventEdit,
  showNewEvents = true,
}) => {
  const [eventEditConfirmationMessage, setEventEditConfirmationMessage] =
    useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Map());
  const [todayEventsState, setTodayEventsState] = useState([]);
  const [upcomingEventsState, setUpcomingEventsState] = useState([]);
  const [registeredEventsState, setRegisteredEventsState] = useState([]);

  useEffect(() => {
    if (events) {
      const idsMap = new Map(
        registrations.map((registration) => [
          registration.eventId,
          registration.approved ?? "approved",
        ])
      );
      setRegisteredEventIds(idsMap);

      const sortedEvents = [...events].sort(function (a, b) {
        const c = new Date(a.date);
        const d = new Date(b.date);
        return c - d;
      });

      const todayEvents = sortedEvents.filter(function (event) {
        let date = new Date(event.date);
        date = new Date(
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
        );
        let today = new Date();
        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        );
      });

      let upcomingEvents = sortedEvents.filter(function (event) {
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
      });

      let registeredEvents = upcomingEvents.filter((event) => {
        return idsMap.has(event._id);
      });

      if (user.role === "volunteer")
        upcomingEvents = upcomingEvents.filter(
          (event) => !idsMap.has(event._id)
        );

      if (upcomingEvents.length > 5) {
        upcomingEvents = upcomingEvents.slice(0, 5);
      }

      if (registeredEvents.length > 2) {
        registeredEvents = registeredEvents.slice(0, 2);
      }

      setTodayEventsState(todayEvents);
      setUpcomingEventsState(upcomingEvents);
      setRegisteredEventsState(registeredEvents);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [events, registrations, user.role]);

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <LoadingModal isOpen={true} />
      </div>
    );
  }

  if (!isHomePage) {
    return (
      <Styled.Container>
        {eventEditConfirmationMessage !== null && (
          <div className="pb-3">
            <Alert
              color="success"
              onDismiss={() => setEventEditConfirmationMessage(null)}
            >
              {eventEditConfirmationMessage}.
            </Alert>
          </div>
        )}
        {events && events.length === 0 ? (
          <p className="justify-content-center mb-4 flex text-lg font-bold text-primaryColor">
            No events scheduled for filter.
          </p>
        ) : (
          events &&
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              user={user}
              isRegistered={
                registeredEventIds.has(event._id)
                  ? registeredEventIds.get(event._id)
                  : false
              }
              onEventDelete={onEventDelete}
              onEventEdit={onEventEdit}
              setEventEdit={setEventEditConfirmationMessage}
            />
          ))
        )}
      </Styled.Container>
    );
  } else {
    if (user.role === "volunteer") {
      return (
        <Styled.HomeContainer>
          <div className="column-flex">
            <p className="font-weight-bold pb-3 text-2xl">Registered Events</p>
            {registeredEventsState.length > 0 && (
              <div>
                {registeredEventsState.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    isRegistered={
                      registeredEventIds.has(event._id)
                        ? registeredEventIds.get(event._id)
                        : false
                    }
                    onEventEdit={onEventEdit}
                  />
                ))}
              </div>
            )}
            {registeredEventsState.length === 0 && (
              <p className="text-5 mb-4 flex items-center justify-center font-normal leading-[100%] tracking-[0%] text-primaryColor">
                You haven&apos;t registered for an event yet!
              </p>
            )}
          </div>
          {showNewEvents && (
            <div className="column-flex">
              <p className="font-weight-bold pb-3 text-2xl">New Events</p>
              {upcomingEventsState.length > 0 &&
                upcomingEventsState.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    isRegistered={
                      registeredEventIds.has(event._id)
                        ? registeredEventIds.get(event._id)
                        : false
                    }
                    onEventEdit={onEventEdit}
                  />
                ))}
              {upcomingEventsState.length === 0 && (
                <p className="justify-content-center mb-4 flex text-lg font-bold text-primaryColor">
                  No new events!
                </p>
              )}
              <Text text="View More" href="/events" />
            </div>
          )}
          <div className="h-12" />
        </Styled.HomeContainer>
      );
    } else if (user.role === "admin") {
      return (
        <div className="w-full">
          {eventEditConfirmationMessage !== null && (
            <div className="pb-3">
              <Alert
                color="success"
                onDismiss={() => setEventEditConfirmationMessage(null)}
              >
                {eventEditConfirmationMessage}.
              </Alert>
            </div>
          )}
          <div className="pb-6">
            <p className="font-weight-bold pb-3 text-2xl">{"Today's Events"}</p>
            {todayEventsState.length > 0 &&
              todayEventsState.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  user={user}
                  onEventDelete={onEventDelete}
                  onEventEdit={onEventEdit}
                  setEventEdit={setEventEditConfirmationMessage}
                />
              ))}
            {todayEventsState.length === 0 && (
              <div className="justify-content-center flex pb-16">
                <p className="font-weight-bold pb-3 text-lg text-primaryColor">
                  No events scheduled today
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="font-weight-bold pb-3 text-2xl">Upcoming Events</p>
            {upcomingEventsState.length > 0 && (
              <div>
                {upcomingEventsState.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    user={user}
                    version={"Secondary"}
                    isRegistered={registeredEventIds.has(event._id)}
                    onEventDelete={onEventDelete}
                    onEventEdit={onEventEdit}
                    setEventEdit={setEventEditConfirmationMessage}
                  />
                ))}
                <Text href={`/events`} text="View More" />
              </div>
            )}
            {upcomingEventsState.length === 0 && (
              <div className="justify-content-center flex">
                <p className="font-weight-bold pb-3 text-lg text-primaryColor">
                  No upcoming events scheduled.
                </p>
              </div>
            )}
            <div className="h-24" />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Text type="subheader" text="Nothing to Display." />
        </div>
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
