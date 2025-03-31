import { Table, Tooltip } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";
import styled from "styled-components";
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
  attendances,
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
            attendances
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((attendance) => (
                <Table.Row key={attendance._id}>
                  <Table.Cell>
                    <a
                      href={`events/${attendance.eventId}`}
                      className="text-primaryColor"
                    >
                      {attendance.eventName ?? "event"}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{attendance.checkinTime.slice(0, 10)}</Table.Cell>
                  <Table.Cell>
                    {convertTime(attendance.checkinTime.slice(11, 16))} -{" "}
                    {attendance.checkoutTime == null
                      ? "N/A"
                      : convertTime(attendance.checkoutTime.slice(11, 16))}
                  </Table.Cell>
                  <Table.Cell>
                    &emsp;
                    {attendance.checkoutTime == null
                      ? "0 hour(s)"
                      : getHours(
                          attendance.checkinTime.slice(11, 16),
                          attendance.checkoutTime.slice(11, 16)
                        ) + " hour(s)"}
                  </Table.Cell>
                </Table.Row>
              ))}
          {!isIndividualStats &&
            attendances
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((attendance) => (
                <Table.Row key={attendance._id}>
                  <Table.Cell>
                    {attendance.volunteerName ?? "Volunteer"}
                  </Table.Cell>
                  <Table.Cell>
                    {attendance.volunteerEmail?.substring(0, 24) + "..."}
                  </Table.Cell>
                  <Table.Cell>
                    &emsp;
                    {attendance.checkoutTime == null
                      ? "0 hour(s)"
                      : getHours(
                          attendance.checkinTime.slice(11, 16),
                          attendance.checkoutTime.slice(11, 16)
                        ) + " hour(s)"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      <Tooltip content="Edit" style="light">
                        <button
                          className="mx-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClicked(attendance);
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
                            onDeleteClicked(attendance);
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
      {attendances.length !== 0 && (
        <Pagination
          items={attendances}
          pageSize={pageSize}
          currentPage={currentPage}
          updatePageCallback={updatePage}
        />
      )}
    </Styled.Container>
  );
};
StatsTable.propTypes = {
  attendances: PropTypes.array,
  isIndividualStats: PropTypes.bool,
  onDeleteClicked: PropTypes.func,
  onEditClicked: PropTypes.func,
};

export default StatsTable;
