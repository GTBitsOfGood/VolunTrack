import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  checkInVolunteer,
  checkOutVolunteer,
} from "../../../../queries/attendances";
import { getEvent, updateEvent } from "../../../../queries/events";
import { getUsers } from "../../../../queries/users";
import AttendanceFunctionality from "./AttendanceFunctionality";
import SearchBar from "../../../../components/SearchBar";
import "flowbite-react";
import Text from "../../../../components/Text";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
import BoGButton from "../../../../components/BoGButton";

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
      const event = await getEvent(eventId);
      setEvent(event.data.event);

      const fetchedMinors = {};
      event.minors.forEach((m) => {
        fetchedMinors[m.volunteer_id] = m.minor;
      });
      setMinors(fetchedMinors);

      setWaitingVolunteers(
        (await getEventVolunteersByAttendance(eventId, "waiting")).data
          .volunteers
      );
      console.log(waitingVolunteers);

      setCheckedInVolunteers(
        (await getUsers(undefined, undefined, eventId, true)).data.users
      );
      setCheckedOutVolunteers(
        (await getUsers(undefined, undefined, eventId, false)).data.users
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
              v.last_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.first_name?.toLowerCase().includes(searchValue.toLowerCase())
          )
        : volunteers
    ).sort((a, b) =>
      a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0
    );
  };

  return (
    <>
      <Styled.Container>
        <Text className="mb-4" href={`/events`} text="< Back to home" />
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
