import "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BoGButton from "../../../../components/BoGButton";
import SearchBar from "../../../../components/SearchBar";
import Text from "../../../../components/Text";
import {
  checkInVolunteer,
  checkOutVolunteer,
} from "../../../../queries/attendances";
import { getEvent, updateEvent } from "../../../../queries/events";
import { getUsers } from "../../../../queries/users";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
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
    font-size: 2rem;
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

    font-size: 1rem;

    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
};

const EventAttendance = () => {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [event, setEvent] = useState({});
  const [minors, setMinors] = useState({});

  const [searchValue, setSearchValue] = useState("");

  const [waitingVolunteers, setWaitingVolunteers] = useState([]);
  const [checkedInVolunteers, setCheckedInVolunteers] = useState([]);
  const [checkedOutVolunteers, setCheckedOutVolunteers] = useState([]);

  useEffect(() => {
    (async () => {
      const eventResponse = await getEvent(eventId);
      setEvent(eventResponse.data.event);

      const waitingUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "waiting"
        )
      ).data.users;
      const checkedInUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "checkedIn"
        )
      ).data.users;
      const checkedOutUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "checkedOut"
        )
      ).data.users;

      setWaitingVolunteers(waitingUsers);
      setCheckedInVolunteers(checkedInUsers);
      setCheckedOutVolunteers(checkedOutUsers);
    })();
  }, []);

  const checkIn = async (volunteer) => {
    await checkInVolunteer(
      volunteer._id,
      eventId,
      volunteer.organizationId,
      volunteer.firstName + " " + volunteer.lastName,
      volunteer.email,
      event.eventParent.title
    );

    setWaitingVolunteers(
      waitingVolunteers.filter((v) => v._id !== volunteer._id)
    );
    setCheckedInVolunteers(checkedInVolunteers.concat(volunteer));
    setCheckedOutVolunteers(
      checkedOutVolunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const checkOut = async (volunteer) => {
    await checkOutVolunteer(volunteer._id, eventId);

    setCheckedOutVolunteers((volunteers) => [...volunteers, volunteer]);
    setCheckedInVolunteers((volunteers) =>
      volunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const endEvent = () => {
    const newEvent = { ...event, isEnded: true };
    setEvent(newEvent);
    updateEvent(eventId, newEvent);
    checkedInVolunteers.forEach((v) => {
      checkOutVolunteer(v._id, eventId);
    });
    setCheckedOutVolunteers(checkedOutVolunteers.concat(checkedInVolunteers));
    setCheckedInVolunteers([]);
  };

  const reopenEvent = () => {
    const newEvent = { ...event, isEnded: false };
    setEvent(newEvent);
    updateEvent(eventId, newEvent);
  };

  const filteredAndSortedVolunteers = (volunteers) => {
    if (volunteers?.length === 0) return [];
    return (
      searchValue.length > 0
        ? volunteers.filter(
            (v) =>
              v.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.firstName?.toLowerCase().includes(searchValue.toLowerCase())
          )
        : volunteers
    ).sort((a, b) =>
      a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0
    );
  };

  return (
    <>
      <Styled.Container>
        <Text className="mb-4" href={`/events`} text="← Back to home" />
        <Styled.HeaderRow>
          <Styled.Header>Attendance Management</Styled.Header>
          <BoGButton text="End Event" onClick={endEvent} />
        </Styled.HeaderRow>
        <SearchBar
          placeholder="Search by Volunteer Name or Email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <AttendanceFunctionality
          waitingVolunteers={filteredAndSortedVolunteers(waitingVolunteers)}
          checkedInVolunteers={filteredAndSortedVolunteers(checkedInVolunteers)}
          checkedOutVolunteers={filteredAndSortedVolunteers(
            checkedOutVolunteers
          )}
          minors={minors}
          checkIn={checkIn}
          checkOut={checkOut}
          isEnded={event?.isEnded}
        />
      </Styled.Container>
      {/* <Footer endEvent={endEvent} reopenEvent={reopenEvent} event={event} /> */}
    </>
  );
};

export default AdminAuthWrapper(EventAttendance);
