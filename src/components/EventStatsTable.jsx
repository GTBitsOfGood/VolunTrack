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

const EventStatsTable = ({
  events,
  isVolunteer,
  // onDeleteClicked,
  // onEditClicked,
}) => {
  const eventName = isVolunteer ? "Event Name" : "Volunteer Name";
  const creation = isVolunteer ? "Date" : "Email Address";
  const time = isVolunteer ? "Time" : "Hours Participated";
  const textInfo = isVolunteer ? "Hours Earned" : "";

  return (
    <Styled.Container>
      <Styled.ul>
        <Styled.List>
          <Table.EventList>
            <Table.InnerTop>
              <Table.EventName>{eventName}</Table.EventName>

              <Table.Creation>{creation}</Table.Creation>

              <Table.Time>{time}</Table.Time>
              <Table.TextInfo>{textInfo}</Table.TextInfo>
            </Table.InnerTop>
          </Table.EventList>
        </Styled.List>

        {isVolunteer == false &&
          events.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event._id}`}>
                <Table.EventList>
                  <Table.Inner>
                    <Table.EventName>{event.title}</Table.EventName>

                    <Table.Creation>{event.date}</Table.Creation>

                    <Table.Time>{event.time}</Table.Time>
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
