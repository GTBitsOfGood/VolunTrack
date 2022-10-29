import Link from "next/link";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import styled from "styled-components";
import * as Table from "../screens/sharedStyles/condensedTableStyles";
import { getHours } from "../screens/Stats/User/hourParsing";
import Icon from "./Icon";

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

const EventTable = ({
  events,
  isVolunteer,
  onDeleteClicked,
  onEditClicked,
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
        {isVolunteer &&
          events.map((event) => (
            <Styled.List key={event._id}>
              <Link href={`events/${event.eventId}`}>
                <Table.EventList>
                  <Table.Inner>
                    <Table.EventName>{event.eventName}</Table.EventName>

                    <Table.Creation>
                      {event.timeCheckedIn.slice(0, 10)}
                    </Table.Creation>

                    <Table.Time>
                      {convertTime(event.timeCheckedIn.slice(11, 16))} -{" "}
                      {event.timeCheckedOut == null
                        ? "N/A"
                        : convertTime(event.timeCheckedOut.slice(11, 16))}
                    </Table.Time>
                    <Table.TextInfo>
                      &emsp;
                      {event.timeCheckedOut == null
                        ? "0 hour(s)"
                        : getHours(
                            event.timeCheckedIn.slice(11, 16),
                            event.timeCheckedOut.slice(11, 16)
                          ) + " hour(s)"}
                    </Table.TextInfo>
                  </Table.Inner>
                </Table.EventList>
              </Link>
            </Styled.List>
          ))}
        {isVolunteer == false &&
          events.map((event) => (
            <Styled.List key={event._id}>
              <Table.EventList>
                <Table.Inner>
                  <Table.EventName>{event.name}</Table.EventName>

                  <Table.Creation>{event.email}</Table.Creation>

                  <Table.Time>{event.hours.toString().slice(0, 5)}</Table.Time>
                  <Table.TextInfo>
                    <Styled.Buttons>
                      <Styled.EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClicked(event);
                        }}
                      >
                        <Icon color="grey3" name="create" />
                      </Styled.EditButton>
                      <Styled.DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClicked(event);
                        }}
                      >
                        <Icon color="grey3" name="delete" />
                      </Styled.DeleteButton>
                    </Styled.Buttons>
                  </Table.TextInfo>
                </Table.Inner>
              </Table.EventList>
            </Styled.List>
          ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.Array,
  isVolunteer: PropTypes.Boolean,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default EventTable;
