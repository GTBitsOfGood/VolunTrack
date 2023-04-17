import { Table, Tooltip } from "flowbite-react";
import { Types } from "mongoose";
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getUser } from "../queries/users";
import { getHours } from "../screens/Stats/User/hourParsing";
import Pagination from "./PaginationComp";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
    margin-bottom: 70px;
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

const StatsTable = ({
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
  const [userEvents, setUserEvents] = useState([]);
  const pageSize = 10;
  const updatePage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const eventsWithUser = () => {
    const eventsWithUser = [];
    for (const event of events) {
      if ("users" in event) {
        getUser(new Types.ObjectId(event.users[0])).then((response) => {
          eventsWithUser.push({ ...event, user: response.data.user });
        });
      } else {
        getUser(new Types.ObjectId(event.userId)).then((response) => {
          eventsWithUser.push({ ...event, user: response.data.user });
        });
      }
    }
    return eventsWithUser;
  };

  useEffect(() => {
    setUserEvents(eventsWithUser());
  }, [events]);

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
                      {event.eventName ?? "event"}
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
            userEvents.length !== 0 &&
            userEvents
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((event) => (
                <Table.Row key={event._id}>
                  <Table.Cell>
                    {event.user.firstName} {event.user.lastName}
                  </Table.Cell>
                  <Table.Cell>
                    {event.user.email?.substring(0, 24) + "..."}
                  </Table.Cell>
                  <Table.Cell>{event.hours.toString().slice(0, 5)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      <Tooltip content="Edit" style="light">
                        <button
                          className="mx-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClicked(event);
                          }}
                        >
                          <PencilIcon className="h-8 text-primaryColor" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete" style="light">
                        <button
                          className="mx-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClicked(event);
                          }}
                        >
                          <TrashIcon className="h-8 text-primaryColor" />
                        </button>
                      </Tooltip>
                    </div>
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
StatsTable.propTypes = {
  events: PropTypes.array,
  isIndividualStats: PropTypes.bool,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default StatsTable;
