import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Table } from "flowbite-react";

const Styled = {
  EventName: styled.div`
    font-size: 15px;
    text-align: center;
    margin-right: 10px;
    width: 30%;
  `,
  Date: styled.div`
    font-size: 15px;
    text-align: center;
    margin-right: 10px;
    width: 20%;
  `,
  Time: styled.div`
    font-size: 15px;
    text-align: center;
    margin-right: 10px;
    width: 25%;
  `,
  Attendance: styled.div`
    font-size: 15px;
    text-align: center;
    margin-right: 10px;
    width: 15%;
  `,
  Hours: styled.div`
    font-size: 15px;
    text-align: center;
    margin-right: 10px;
    width: 15%;
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

const EventStatsTable = ({ events, isVolunteer }) => {
  return (
    <Table style={{ width: "100%", height: "100%", margin: "auto", marginBottom: "70px"}} striped={true}>
      <Table.Head>
        <Styled.EventName>Event Name</Styled.EventName>
        <Styled.Date>Date</Styled.Date>
        <Styled.Time>Time</Styled.Time>
        <Styled.Attendance>Attendance</Styled.Attendance>
        <Styled.Hours>Hours</Styled.Hours>
      </Table.Head>

      {isVolunteer === false &&
        events.map((event) => (
          <Table.Row key={event._id}>
            <Link href={`events/${event._id}`}>
              <Table.Cell>
                <Styled.EventName>{event.title}</Styled.EventName>
              </Table.Cell>
              <Table.Cell>
                <Styled.Date>{event.date.substring(0, 10)}</Styled.Date>
              </Table.Cell>
              <Table.Cell>
                <Styled.Time>
                  {convertTime(event.startTime)} - {convertTime(event.endTime)}{" "}
                  {event.localTime}
                </Styled.Time>
              </Table.Cell>
              <Table.Cell>
                <Styled.Attendance>{event.attendance}</Styled.Attendance>
              </Table.Cell>
              <Table.Cell>
                <Styled.Hours>{event.hours}</Styled.Hours>
              </Table.Cell>
            </Link>
          </Table.Row>
        ))}
    </Table>
  );
};
EventStatsTable.propTypes = {
  events: PropTypes.Array,
  isVolunteer: PropTypes.Boolean,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default EventStatsTable;
