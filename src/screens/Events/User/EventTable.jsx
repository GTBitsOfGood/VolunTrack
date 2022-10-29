import { useSession } from "next-auth/react";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import * as Table from "../../sharedStyles/tableStyles";
import { getEventVolunteersByAttendance } from "../../../actions/queries";
import { Row, Col } from "reactstrap";

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
    list-style-type: none;
    display: flex;
    flex-direction: column;
  `,
  List: styled.li`
    padding-bottom: 120px;
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

const getMinorTotal = (minors) => {
  let total = 0;
  minors.forEach((minorObj) => {
    total += minorObj.minor.length;
  });
  return total;
};

const sliceEventDate = (dateNum) => {
  let eventDate = "";
  eventDate =
    dateNum.slice(5, 7) +
    "/" +
    dateNum.slice(8, 10) +
    "/" +
    dateNum.slice(0, 4);
  return eventDate;
};

const isCheckedIn = (eventId, user) => {
  return getEventVolunteersByAttendance(eventId, true).then((r) =>
    r.data.some((v) => v._id === user._id)
  );
};

const monthMap = new Map([
  ["Jan", "01"],
  ["Feb", "02"],
  ["Mar", "03"],
  ["Apr", "04"],
  ["May", "05"],
  ["Jun", "06"],
  ["Jul", "07"],
  ["Aug", "08"],
  ["Sep", "09"],
  ["Oct", "10"],
  ["Nov", "11"],
  ["Dec", "12"],
]);

const compareDateString = (dateNum) => {
  let date = "";
  let dateArr = dateNum.split(" ");
  date = monthMap.get(dateArr[0]);
  date += "/" + dateArr[1];
  date += "/" + dateArr[2];
  return date;
};

const filterEvents = (events, user) => {
  let arr = [];
  for (let i = 0; i < events.length; i++) {
    if (
      events[i].isPrivate !== "true" ||
      events[i].volunteers.includes(user._id)
    ) {
      arr.push(events[i]);
    }
  }
  return arr;
};

const EventTable = ({
  dateString,
  events,
  onRegisterClicked,
  onUnregister,
  user,
}) => {
  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }
  const filteredEvents = filterEvents(events, user);
  return (
    <Styled.Container>
      <Styled.ul>
        {filteredEvents.map((event) => (
          <Styled.List key={event._id}>
            <Link href={`events/${event._id}`}>
              <Table.EventList>
                <Table.Inner>
                  <Col>
                    <Row>
                      <Table.Register>
                        {event.volunteers.includes(user._id) ? (
                          <>
                            <Styled.Button onClick={() => onUnregister(event)}>
                              <Icon color="grey3" name="delete" />
                              <span>Unregister</span>
                            </Styled.Button>
                          </>
                        ) : (
                          <Styled.Button
                            onClick={() => onRegisterClicked(event)}
                          >
                            <Icon color="grey3" name="add" />
                            <span>Sign up</span>
                          </Styled.Button>
                        )}
                      </Table.Register>
                      <Table.TextInfo>
                        <Table.TitleAddNums>
                          <Table.EventName>{event.title}</Table.EventName>
                          <Table.Volunteers>
                            {sliceEventDate(event.date) <
                            compareDateString(dateString) ? (
                              <Table.Text>
                                <Table.Volunteers>
                                  {event.volunteers.length +
                                    getMinorTotal(event.minors)}
                                </Table.Volunteers>
                                <Table.Slots>Slots Available</Table.Slots>
                              </Table.Text>
                            ) : (
                              <Table.Text>
                                <Table.Volunteers>
                                  {event.max_volunteers -
                                    event.volunteers.length +
                                    getMinorTotal(event.minors)}
                                </Table.Volunteers>
                                <Table.Slots>Volunteers Attended</Table.Slots>
                              </Table.Text>
                            )}
                          </Table.Volunteers>
                        </Table.TitleAddNums>
                        <Table.Time>
                          {convertTime(event.startTime)} -{" "}
                          {convertTime(event.endTime)} EST
                        </Table.Time>
                      </Table.TextInfo>
                      <Table.Creation>
                        {sliceEventDate(event.date)}
                      </Table.Creation>
                    </Row>{" "}
                    {Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) -
                      14400000 ==
                      Date.parse(event.date) &&
                    event.volunteers.includes(user._id) ? (
                      <Row>
                        {isCheckedIn(event._id, user) ? (
                          <>
                            <Table.CheckinDone>
                              <text>
                                You are checked in! When it is time to check
                                out, please check out by finding an admin.
                              </text>
                            </Table.CheckinDone>
                          </>
                        ) : (
                          <Table.Checkin>
                            <text>Please check in by finding an admin.</text>
                          </Table.Checkin>
                        )}
                      </Row>
                    ) : (
                      <Row></Row>
                    )}
                  </Col>
                </Table.Inner>
              </Table.EventList>
            </Link>
          </Styled.List>
        ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.Array,
  onRegisterClicked: PropTypes.func,
  onUnregister: PropTypes.func,
  user: PropTypes.object,
};

export default EventTable;
