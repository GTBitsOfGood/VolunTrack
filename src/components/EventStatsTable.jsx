import { Table } from "flowbite-react";
import Link from "next/link";
import PropTypes from "prop-types";

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
    <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
      <Table.Head>
        <Table.HeadCell>Event Name</Table.HeadCell>
        <Table.HeadCell>Date</Table.HeadCell>
        <Table.HeadCell>Time</Table.HeadCell>
        <Table.HeadCell>Attendance</Table.HeadCell>
        <Table.HeadCell>Hours</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {isVolunteer === false &&
          events.map((event) => (
            <Table.Row key={event._id}>
              <Table.Cell>
                <Link href={`events/${event._id}`}>{event.title}</Link>
              </Table.Cell>
              <Table.Cell>{event.date.substring(0, 10)}</Table.Cell>
              <Table.Cell>
                {convertTime(event.eventParent.startTime)} -{" "}
                {convertTime(event.eventParent.endTime)}{" "}
                {event.eventParent.localTime}
              </Table.Cell>
              <Table.Cell>{event.attendance}</Table.Cell>
              <Table.Cell>{event.hours}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
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
