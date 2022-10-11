import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  checkInVolunteer,
  checkOutVolunteer,
  getEventVolunteersByAttendance,
} from "../../../../actions/queries";
import AttendanceFunctionality from "./AttendanceFunctionality";

const Styled = {
  Container: styled.div`
    width: 90vw;
    max-width: 96rem;
    margin: 0 auto;
    padding: 2rem 0 0 0;
  `,
  Header: styled.h1`
    margin: 0;

    font-size: 3rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
    justify-content: space-between;
  `,
  CheckedInData: styled.p`
    margin: 0;

    font-size: 2rem;
    vertical-align: top;
  `,
  Search: styled.input`
    height: 3rem;
    width: 100%;
    margin: 0;
    padding: 0 0.5rem;

    font-size: 1.5rem;

    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
};

const EventAttendance = () => {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [searchValue, setSearchValue] = useState("");

  const [checkedInVolunteers, setCheckedInVolunteers] = useState([]);
  const [checkedOutVolunteers, setCheckedOutVolunteers] = useState([]);

  useEffect(() => {
    (async () => {
      setCheckedInVolunteers(
        (await getEventVolunteersByAttendance(eventId, true)).data
      );
      setCheckedOutVolunteers(
        (await getEventVolunteersByAttendance(eventId, false)).data
      );
    })();
  }, []);

  const checkIn = (volunteer) => {
    checkInVolunteer(volunteer._id, eventId);

    setCheckedInVolunteers(checkedInVolunteers.concat(volunteer));
    setCheckedOutVolunteers(
      checkedOutVolunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const checkOut = (volunteer) => {
    checkOutVolunteer(volunteer._id, eventId);

    setCheckedOutVolunteers(checkedOutVolunteers.concat(volunteer));
    setCheckedInVolunteers(
      checkedInVolunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const filteredAndSortedVolunteers = (volunteers) =>
    (searchValue.length > 0
      ? volunteers.filter(
          (v) =>
            v.bio.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            v.bio.email.toLowerCase().includes(searchValue.toLowerCase())
        )
      : volunteers
    ).sort((a, b) =>
      a.bio.last_name > b.bio.last_name
        ? 1
        : b.bio.last_name > a.bio.last_name
        ? -1
        : 0
    );

  return (
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>Attendance</Styled.Header>
        <Styled.CheckedInData>
          <span style={{ fontWeight: "bold" }}>
            <span style={{ fontWeight: "bold", fontSize: "3rem" }}>
              {checkedInVolunteers.length}
            </span>
            <span style={{ fontWeight: "normal" }}>/</span>
            {checkedInVolunteers.length + checkedOutVolunteers.length}
          </span>{" "}
          Checked In
        </Styled.CheckedInData>
      </Styled.HeaderRow>

      <Styled.Search
        placeholder="Search Last Name or Email"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <AttendanceFunctionality
        checkedInVolunteers={filteredAndSortedVolunteers(checkedInVolunteers)}
        checkedOutVolunteers={filteredAndSortedVolunteers(checkedOutVolunteers)}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </Styled.Container>
  );
};

export default EventAttendance;
