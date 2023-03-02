import Link from "next/link";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import styled from "styled-components";
import variables from "../../design-tokens/_variables.module.scss";
import { useSession } from "next-auth/react";
import Event from "../../components/Event";

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
  EventContainer: styled.div`
    width: 100%;
    margin: 0 0 2rem 0;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;

    background-color: white;
    border: 1px solid ${variables["gray-200"]};
    border-radius: 1rem;

    cursor: pointer;
  `,
  EventGrid: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
  `,
  EventContent: styled.div`
    width: 100%;
    margin: 0;

    display: flex;
    flex-direction: column;
  `,
  EventContentRow: styled.div`
    height: 50%;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  EventTitle: styled.h3`
    margin: 0;
    padding: 0;

    font-size: 1.5rem;
    font-weight: bold;
  `,
  EventSlots: styled.p`
    margin: 0 0 0 1rem;

    color: grey;
  `,
  EditButton: styled(Button)`
    margin: 0 0 0 auto;

    background: none;
    border: none;
  `,
  DeleteButton: styled(Button)`
    background: none;
    border: none;

    justify-self: right;
  `,
  Time: styled.p`
    margin: 0 auto 0 0;

    font-size: 1.2rem;
  `,
  Date: styled.p`
    margin: 0 1rem 0 0;
    color: grey;
  `,
  Spacer: styled.div`
    height: 12rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
    color: #000;
    padding: 0.5rem;
    margin: 0 0 0 auto;
  `,
  EventSpace: styled.div`
    padding: 0.5rem;
    margin: 0 0 0 auto;
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
    color: ${variables["primary"]};
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

const EventTable = ({
  dateString,
  events,
  onEditClicked,
  onDeleteClicked,
  onRegisterClicked,
  onUnregister,
  user,
  role,
  isHomePage,
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

  let funcs = {
    onDeleteClicked: onDeleteClicked,
    onEditClicked: onEditClicked,
    onRegisterClicked: onRegisterClicked,
    onUnregister: onUnregister,
    convertTime: convertTime,
  };

  if (!isHomePage) {
    return (
      <Styled.Container>
        {events.map((event) => (
          <Event
            key={event._id}
            eventObj={event}
            role={role}
            user={user}
            functions={funcs}
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
            <Styled.Events>Your Upcoming Events</Styled.Events>
            {registeredEvents.map((event) => (
              <Event
                key={event._id}
                eventObj={event}
                role={role}
                user={user}
                functions={funcs}
                onRegisterClicked={onRegisterClicked}
              />
            ))}
          </Styled.ul>

          <Styled.ul>
            <Styled.Events>New Events</Styled.Events>
            {upcomingEvents.map((event) => (
              <Event
                key={event._id}
                eventObj={event}
                role={role}
                user={user}
                functions={funcs}
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
            <Event
              key={event._id}
              eventObj={event}
              role={role}
              user={user}
              functions={funcs}
              onRegisterClicked={onRegisterClicked}
            />
          ))}
          <Styled.Spacer />
        </Styled.Container>
      );
    } else if (upcomingEvents.length > 0) {
      return (
        <Styled.Container>
          <Styled.Events>New Events</Styled.Events>
          {upcomingEvents.map((event) => (
            <Event
              key={event._id}
              eventObj={event}
              role={role}
              user={user}
              functions={funcs}
              onRegisterClicked={onRegisterClicked}
            />
          ))}
          <Link href={`/events`}>
            <Styled.LinkedText>View More</Styled.LinkedText>
          </Link>
          <Styled.Spacer />
        </Styled.Container>
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
EventTable.propTypes = {
  dateString: PropTypes.string,
  events: PropTypes.Array,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func,
  onRegisterClicked: PropTypes.func,
  onUnregister: PropTypes.func,
  user: PropTypes.object,
  role: PropTypes.string,
  isHomePage: PropTypes.bool,
};

export default EventTable;
