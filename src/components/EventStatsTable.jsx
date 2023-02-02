import Link from "next/link";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import styled from "styled-components";
import * as Table from "../screens/sharedStyles/condensedTableStyles";
// import { getHours } from "../screens/Stats/User/hourParsing";
// import Icon from "./Icon";

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
    margin-bottom: 70px;
  `,
  ul: styled.div`
    display: flex;
    flex-direction: column;
    list-style-type: none;
  `,
  Heading: styled.div`
    display: flex;
    flex-direction: column;
    list-style-type: none;
    font-size: 27px;
    font-weight: bold;
    padding: 5px;
  `,
  List: styled.li``,
  Buttons: styled.div`
    flex-direction: row;
  `,
  EditButton: styled(Button)`
    margin: 0 0 0 auto;

    background: none;
    border: none;
  `,
  DeleteButton: styled(Button)`
    background: none;
    border: none;

    margin: 0 0 0 auto;
  `,

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

// const convertTime = (time) => {
//   let [hour, min] = time.split(":");
//   let hours = parseInt(hour);
//   let suffix = time[-2];
//   if (!(suffix in ["pm", "am", "PM", "AM"])) {
//     suffix = hours > 11 ? "pm" : "am";
//   }
//   hours = ((hours + 11) % 12) + 1;
//   return hours.toString() + ":" + min + suffix;
// };

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

const EventStatsTable = ({
  events,
  isVolunteer,
  // onDeleteClicked,
  // onEditClicked,
}) => {
  const eventName = "Event Name";
  const creation = "Email Address";
  const time = "Hours Participated";
  const textInfo = "";

  return (
    <Styled.Container>
      <Styled.ul>
        <Styled.List>
          <Table.EventList>
            <Table.InnerTop>
              <Styled.EventName>Event Name</Styled.EventName>

              <Styled.Date>Date</Styled.Date>

              <Styled.Time>Time</Styled.Time>
              <Styled.Attendance>Attendance</Styled.Attendance>
              <Styled.Hours>Hours</Styled.Hours>
            </Table.InnerTop>
          </Table.EventList>
        </Styled.List>

        {isVolunteer == false &&
          events.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList>
                  <Table.Inner>
                    <Styled.EventName>{event.title}</Styled.EventName>

                    <Styled.Date>{event.date.substring(0, 10)}</Styled.Date>

                    <Styled.Time>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} {event.localTime}
                    </Styled.Time>

                    <Styled.Attendance>{event.attendance}</Styled.Attendance>

                    <Styled.Hours>{event.hours}</Styled.Hours>
                  </Table.Inner>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventStatsTable.propTypes = {
  events: PropTypes.Array,
  isVolunteer: PropTypes.Boolean,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default EventStatsTable;

/*
{(Object.values(eventStats).find(stats => stats._id === eventId).attendance > 0 )}
*/
