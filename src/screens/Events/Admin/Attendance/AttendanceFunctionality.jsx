import styled from "styled-components";
import Volunteer from "./Volunteer";
import "flowbite-react";
import { Table } from "flowbite-react";

const Styled = {
  InfoText: styled.p`
    margin: 2rem 0 1rem 0;
    padding 0;

    color: gray;
  `,
  VolunteerContainer: styled.div`
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  `,
};

const AttendanceFunctionality = ({
  waitingVolunteers,
  checkedInVolunteers,
  checkedOutVolunteers,
  minors,
  checkIn,
  checkOut,
  isEnded,
}) => (
  <>
    <Styled.InfoText className="font-bold text-black">Check-In</Styled.InfoText>
    <Table>
      <Table.Head>
        <Table.HeadCell>
          <span className="sr-only">Check-In</span>
        </Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Phone</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {waitingVolunteers?.length > 0 &&
          waitingVolunteers.map((volunteer) => (
            <Volunteer
              key={volunteer._id}
              volunteer={volunteer}
              minors={minors[volunteer._id]}
              onClick={checkIn}
              checkInStatus={"waiting"}
              isEnded={isEnded}
            />
          ))}
      </Table.Body>
    </Table>

    <Styled.InfoText className="font-bold text-black">
      Check-Out
    </Styled.InfoText>
    <Table>
      <Table.Head>
        <Table.HeadCell>
          <span className="sr-only">Check-Out</span>
        </Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Phone</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {checkedInVolunteers?.length > 0 &&
          checkedInVolunteers.map((volunteer) => (
            <Volunteer
              key={volunteer._id}
              volunteer={volunteer}
              minors={minors[volunteer._id]}
              onClick={checkOut}
              checkInStatus={"checked in"}
              isEnded={isEnded}
            />
          ))}
        {checkedOutVolunteers?.length > 0 &&
          checkedOutVolunteers.map((volunteer) => (
            <Volunteer
              key={volunteer._id}
              volunteer={volunteer}
              minors={minors[volunteer._id]}
              onClick={checkOut}
              checkInStatus={"checked out"}
              isEnded={isEnded}
            />
          ))}
      </Table.Body>
    </Table>
  </>
);
export default AttendanceFunctionality;
