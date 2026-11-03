import { Table, Tooltip } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";
import styled from "styled-components";
import {
  getHours,
  formatHours,
  formatAttendanceDate,
  formatAttendanceTime,
} from "../screens/Stats/User/hourParsing";
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
                      href={`/events/${attendance.eventId}`}
                      className="text-primaryColor"
                    >
                      {attendance.eventName ?? "event"}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {formatAttendanceDate(attendance.checkinTime)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatAttendanceTime(attendance.checkinTime)} -{" "}
                    {attendance.checkoutTime == null
                      ? "N/A"
                      : formatAttendanceTime(attendance.checkoutTime)}
                  </Table.Cell>
                  <Table.Cell>
                    &emsp;
                    {formatHours(
                      getHours(attendance.checkinTime, attendance.checkoutTime)
                    )}
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
                    {formatHours(
                      getHours(attendance.checkinTime, attendance.checkoutTime)
                    )}
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
