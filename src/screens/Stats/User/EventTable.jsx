import Link from "next/link";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import styled from "styled-components";
import * as Table from "../../sharedStyles/condensedTableStyles";
import { getHours } from "./hourParsing";

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

const EventTable = ({ events }) => {
  return (
    <Styled.Container>
      <Styled.ul>
        <Styled.List>
          <Table.EventList>
            <Table.InnerTop>
              <Table.EventName>Event Name</Table.EventName>

              <Table.Creation>Date</Table.Creation>

              <Table.Time>Time</Table.Time>
              <Table.TextInfo>Hours Earned</Table.TextInfo>
            </Table.InnerTop>
          </Table.EventList>
        </Styled.List>
        {events.map((event) => (
          <Styled.List key={event._id}>
            <Link href={`events/${event._id}`}>
              <Table.EventList>
                <Table.Inner>
                  <Table.EventName>{event.title}</Table.EventName>

                  <Table.Creation>{event.date.slice(0, 10)}</Table.Creation>

                  <Table.Time>
                    {convertTime(event.startTime)} -{" "}
                    {convertTime(event.endTime)}
                  </Table.Time>
                  <Table.TextInfo>
                    &emsp;{getHours(event.startTime, event.endTime)} hour(s)
                  </Table.TextInfo>
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
};

export default EventTable;
