import PropTypes from "prop-types";
import styled from "styled-components";
import EventCard from "../../components/EventCard";
import { useState } from "react";
import { Alert, Toast } from "flowbite-react";

const Styled = {
  Container: styled.div`
    max-height: 60vh;
    // min-height: min-content;
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
}) => {
  const [eventEditConfirmationMessage, setEventEditConfirmationMessage] =
    useState(null);
  events.sort(function (a, b) {
    const c = new Date(a.date);
    const d = new Date(b.date);
    return c - d;
  });

  const todayEvents = events.filter(function (event) {
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

  let upcomingEvents = events.filter(function (event) {
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
    const [hours, minutes] = event.eventParent.endTime.split(":").map(Number);
    eventDate.setUTCHours(hours, minutes);

    return eventDate >= utcNow;
  });

  const registeredEventIds = new Set(
    registrations.map((registration) => registration.eventId)
  );

  let registeredEvents = upcomingEvents.filter((event) => {
    return registeredEventIds.has(event._id);
  });

  if (user.role === "volunteer")
    upcomingEvents = upcomingEvents.filter(
      (event) => !registeredEventIds.has(event._id)
    );

  if (upcomingEvents.length > 5) {
    upcomingEvents = upcomingEvents.slice(0, 5);
  }

  if (registeredEvents.length > 2) {
    registeredEvents = registeredEvents.slice(0, 2);
  }

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
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          user={user}
          isRegistered={registeredEventIds.has(event._id)}
          onEventDelete={onEventDelete}
          setEventEdit={setEventEditConfirmationMessage}
        />
      ))}
      <div className="h-12" />
    </Styled.Container>
  );
};
EventsList.propTypes = {
  dateString: PropTypes.string,
  events: PropTypes.Array,
  user: PropTypes.object,
  isHomePage: PropTypes.bool,
  onCreateClicked: PropTypes.func,
};

export default EventsList;
