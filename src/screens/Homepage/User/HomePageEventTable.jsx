import { useSession } from "next-auth/react";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import * as Table from "../../sharedStyles/tableStyles";
import { fetchEvents } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
    color: #000;
    padding: 0;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.div`
    display: flex;
    flex-direction: column;
    list-style-type: none;
  `,
  List: styled.li`
    padding-bottom: 120px;
  `,
  Events: styled.div`
    text-align: left;
    font-size: 36px;
    font-weight: bold;
    width: 50%;
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
  `
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

const getMinorTotal = (minors) => {
  let total = 0;
  minors.forEach((minorObj) => {
    total += minorObj.minor.length;
  });
  return total;
};

const registerButtonStyle = {
  "right": 0,
  "left": "unset"
}

const eventListStyle = {
  "width": "unset"
}

const creationStyle = {
  "text-align": "left",
  "right": 0,
  "left": "unset"
}

const HomePageEventTable = ({
  events,
  onUnregister,
  user,
}) => {
  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }

  var upcomingEvents = events.filter(function (event) {
    const currentDate = new Date();
    return new Date(event.date) > currentDate;
  });
  upcomingEvents.sort(function (a, b) {
    var c = new Date(a.date);
    var d = new Date(b.date);
    return c - d;
  });

  const registeredEvents = upcomingEvents.filter(function (event) {
    return event.volunteers.includes(user._id);
  });

  if (upcomingEvents.length > 5) {
    upcomingEvents = upcomingEvents.slice(0, 5);
  }

  if (registeredEvents.length > 2) {
    upcomingEvents = upcomingEvents.slice(0, 2);
  }

  if (registeredEvents.length > 0 && upcomingEvents.length > 0) {
    return (
      <Styled.Container>
        <Styled.ul>
          <Styled.Events>Your Upcoming Events</Styled.Events>
          {registeredEvents.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList style={eventListStyle}>
                  <Table.Inner style={{width: "55vw"}}>
                    <Table.Register style={registerButtonStyle}>
                      <>
                        <Styled.Button onClick={() => onUnregister(event)}>
                          <Icon color="grey3" name="delete" />
                          <span>Unregister</span>
                        </Styled.Button>
                      </>
                    </Table.Register>
                    <Table.TextInfo>
                      <Table.TitleAddNums>
                        <Table.EventName>{event.title}</Table.EventName>
                      </Table.TitleAddNums>
                      <Table.Time>
                        {convertTime(event.startTime)} -{" "}
                        {convertTime(event.endTime)} EST
                      </Table.Time>
                    </Table.TextInfo>
                  </Table.Inner>
                  <Table.Creation style={creationStyle}>
                    {" "}
                    {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                    {event.date.slice(0, 4)}{" "}
                  </Table.Creation>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
        </Styled.ul>

        <Styled.ul>
          <Styled.Events>
            New Events 
          </Styled.Events>
          {upcomingEvents.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList style={eventListStyle}>
                  <Table.Inner style={{width: "55vw"}}>
                    <Table.Register style={registerButtonStyle}>
                    </Table.Register>
                    <Table.TextInfo>
                      <Table.TitleAddNums>
                        <Table.EventName>{event.title}</Table.EventName>
                        <Table.Volunteers>
                          {" "}
                          {event.max_volunteers -
                            event.volunteers.length +
                            getMinorTotal(event.minors)}{" "}
                          slots available
                        </Table.Volunteers>
                      </Table.TitleAddNums>
                      <Table.Time>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} EST
                    </Table.Time>
                   </Table.TextInfo>
                  </Table.Inner>
                  <Table.Creation style={creationStyle}>
                    {" "}
                    {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                    {event.date.slice(0, 4)}{" "}
                  </Table.Creation>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
        <Link href={`/events`}>
          <Styled.LinkedText>View More</Styled.LinkedText>
        </Link>
        </Styled.ul>
      </Styled.Container>
    );
  } else if (registeredEvents.length > 0) {
    return (
      <Styled.Container>
        <Styled.ul>
          <Styled.Events>Your Upcoming Events</Styled.Events>
          {registeredEvents.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList style={eventListStyle}>
                  <Table.Inner style={{width: "55vw"}}>
                    <Table.Register style={registerButtonStyle}>
                      <>
                        <Styled.Button onClick={() => onUnregister(event)}>
                          <Icon color="grey3" name="delete" />
                          <span>Unregister</span>
                        </Styled.Button>
                      </>
                    </Table.Register>
                    <Table.TextInfo>
                      <Table.TitleAddNums>
                        <Table.EventName>{event.title}</Table.EventName>
                      </Table.TitleAddNums>
                      <Table.Time>
                        {convertTime(event.startTime)} -{" "}
                        {convertTime(event.endTime)} EST
                      </Table.Time>

                    </Table.TextInfo>
                  </Table.Inner>
                  <Table.Creation style={creationStyle}>
                    {" "}
                    {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                    {event.date.slice(0, 4)}{" "}
                  </Table.Creation>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
        </Styled.ul>
      </Styled.Container>
    );
  } else if (upcomingEvents.length > 0) {
    return (
      <Styled.Container>
        <Styled.Events>New Events</Styled.Events>
        <Styled.ul>
          {upcomingEvents.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList style={eventListStyle}>
                  <Table.Inner style={{width: "55vw"}}>
                    <Table.TextInfo>
                      <Table.TitleAddNums>
                        <Table.EventName>{event.title}</Table.EventName>
                        <Table.Volunteers>
                          {" "}
                          {event.max_volunteers -
                            event.volunteers.length +
                            getMinorTotal(event.minors)}{" "}
                          slots available
                        </Table.Volunteers>
                      </Table.TitleAddNums>
                      <Table.Time>
                        {convertTime(event.startTime)} -{" "}
                        {convertTime(event.endTime)} EST
                      </Table.Time>
                    </Table.TextInfo>
                  </Table.Inner>
                  <Table.Creation style={creationStyle}>
                    {" "}
                    {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                    {event.date.slice(0, 4)}{" "}
                  </Table.Creation>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
          <Link href={`/events`}>
            <Styled.LinkedText>View More</Styled.LinkedText>
          </Link>
        </Styled.ul>
      </Styled.Container>
    );
  } else {
    return (
      <Styled.Container>
        <Styled.Events>Nothing to Display.</Styled.Events>
      </Styled.Container>
    );
  }
};
HomePageEventTable.propTypes = {
  events: PropTypes.Array,
  onUnregister: PropTypes.func,
  user: PropTypes.object,
};

export default HomePageEventTable;
