import Link from "next/link";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import variables from "../../../design-tokens/_variables.module.scss";
import ManageAttendanceButton from "./ManageAttendanceButton";

const Styled = {
  Container: styled.div`
    width: 48vw;
    max-height: 100vh;
    min-height: min-content;
    overflow-y: auto;
  `,
  EventContainer: styled.div`
    width: 100%;
    margin: 0 0 2rem 0;
    padding: 1rem;

    display: flex;
    flex-direction: column;

    background-color: white;
    border: 1px solid ${variables["gray-200"]};
    border-radius: 1rem;

    cursor: pointer;
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
    padding: 9px;
    background: none;
    border: none;
  `,
  DeleteButton: styled(Button)`
    background: none;
    border: none;
    padding: 9px;
    margin-left: 5px;
    margin-right: 8px;
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

const EventTable = ({ dateString, events, onEditClicked, onDeleteClicked }) => {
  return (
    <Styled.Container>
      {events.map((event) => (
        <Styled.EventContainer key={event._id}>
          <Link href={`events/${event._id}`}>
            <Styled.EventContent>
              <Styled.EventContentRow>
                <Styled.EventTitle>{event.title}</Styled.EventTitle>
                <Styled.EventSlots>
                  {event.max_volunteers - event.volunteers.length} slots
                  available
                </Styled.EventSlots>
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
              </Styled.EventContentRow>
              <Styled.EventContentRow>
                <Styled.Time>
                  {`${convertTime(event.startTime)} - ${convertTime(
                    event.endTime
                  )} ` + event.localTime}
                </Styled.Time>
                <Styled.Date>{sliceEventDate(event.date)}</Styled.Date>
              </Styled.EventContentRow>
            </Styled.EventContent>
          </Link>
          {Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) - 14400000 ==
            Date.parse(event.date) && (
            <ManageAttendanceButton eventId={event._id} />
          )}
        </Styled.EventContainer>
      ))}
      <Styled.Spacer />
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.Array,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func,
};

export default EventTable;
