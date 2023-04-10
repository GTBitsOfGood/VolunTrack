import { Table } from "flowbite-react";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { getHours } from "../screens/Stats/User/hourParsing";
import { Icon } from "./Icon";
import Pagination from "./PaginationComp";

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
  isIndividualStats,
  onDeleteClicked,
  onEditClicked,
}) => {
  const eventName = isIndividualStats ? "Event Name" : "Volunteer Name";
  const creation = isIndividualStats ? "Date" : "Email Address";
  const time = isIndividualStats ? "Time" : "Hours Participated";
  const textInfo = isIndividualStats ? "Hours Earned" : "";
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const updatePage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <Styled.Container>
      <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
        <Table.Head>
          <Table.HeadCell>{eventName}</Table.HeadCell>
          <Table.HeadCell>{creation}</Table.HeadCell>
          <Table.HeadCell>{time}</Table.HeadCell>
          <Table.HeadCell>{textInfo}</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {isIndividualStats &&
            events
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((event) => (
                <Table.Row key={event._id}>
                  <Table.Cell>
                    <Link href={`events/${event.eventId}`}>
                      {event.eventName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{event.checkinTime.slice(0, 10)}</Table.Cell>
                  <Table.Cell>
                    {convertTime(event.checkinTime.slice(11, 16))} -{" "}
                    {event.checkoutTime == null
                      ? "N/A"
                      : convertTime(event.checkoutTime.slice(11, 16))}
                  </Table.Cell>
                  <Table.Cell>
                    &emsp;
                    {event.checkoutTime == null
                      ? "0 hour(s)"
                      : getHours(
                          event.checkinTime.slice(11, 16),
                          event.checkoutTime.slice(11, 16)
                        ) + " hour(s)"}
                  </Table.Cell>
                </Table.Row>
              ))}
          {!isIndividualStats &&
            events
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((event) => (
                <Table.Row key={event._id}>
                  <Table.Cell>{event.volunteerName}</Table.Cell>
                  <Table.Cell>
                    {event.volunteerEmail?.substring(0, 24) + "..."}
                  </Table.Cell>
                  <Table.Cell>{event.hours.toString().slice(0, 5)}</Table.Cell>
                  <Table.Cell>
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
                  </Table.Cell>
                </Table.Row>
              ))}
        </Table.Body>
      </Table>
      {events.length !== 0 && (
        <Pagination
          items={events}
          pageSize={pageSize}
          currentPage={currentPage}
          updatePageCallback={updatePage}
        />
      )}
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.array,
  isIndividualStats: PropTypes.bool,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default EventTable;
