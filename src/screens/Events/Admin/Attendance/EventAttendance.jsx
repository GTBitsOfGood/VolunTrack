import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  checkInVolunteer,
  checkOutVolunteer,
  fetchEventsById,
  getEventVolunteersByAttendance,
  updateEventById,
} from "../../../../actions/queries";
import AttendanceFunctionality from "./AttendanceFunctionality";
import "flowbite-react";
import { Button } from "flowbite-react";
import Link from "next/link";

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
      const fetchedEvent = (await fetchEventsById(eventId)).data.event;
      setEvent(fetchedEvent);

      const fetchedMinors = {};
      fetchedEvent.minors.forEach((m) => {
        fetchedMinors[m.volunteer_id] = m.minor;
      });
      setMinors(fetchedMinors);

      setWaitingVolunteers(
        (await getEventVolunteersByAttendance(eventId, "waiting")).data
          .volunteers
      );
      console.log(waitingVolunteers);

      setCheckedInVolunteers(
        (await getEventVolunteersByAttendance(eventId, "checked in")).data
          .volunteers
      );
      setCheckedOutVolunteers(
        (await getEventVolunteersByAttendance(eventId, "checked out")).data
          .volunteers
      );
    })();
  }, []);

  const checkIn = (volunteer) => {
    checkInVolunteer(
      volunteer._id,
      eventId,
      event.title,
      volunteer.bio.first_name + " " + volunteer.bio.last_name,
      volunteer.bio.email
    );
    setCheckedInVolunteers((volunteers) => [...volunteers, volunteer]);
    setWaitingVolunteers((volunteers) =>
      volunteers.filter((v) => v._id !== volunteer._id)
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
    updateEventById(eventId, newEvent);
    checkedInVolunteers.forEach((v) => {
      checkOutVolunteer(v._id, eventId);
    });
    setCheckedOutVolunteers(checkedOutVolunteers.concat(checkedInVolunteers));
    setCheckedInVolunteers([]);
  };

  const reopenEvent = () => {
    const newEvent = { ...event, isEnded: false };
    setEvent(newEvent);
    updateEventById(eventId, newEvent);
  };

  const filteredAndSortedVolunteers = (volunteers) => {
    if (volunteers?.length === 0) return [];
    return (
      searchValue.length > 0
        ? volunteers.filter(
            (v) =>
              v.bio.last_name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              v.bio.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.bio.first_name
                ?.toLowerCase()
                .includes(searchValue.toLowerCase())
          )
        : volunteers
    ).sort((a, b) =>
      a.bio.last_name > b.bio.last_name
        ? 1
        : b.bio.last_name > a.bio.last_name
        ? -1
        : 0
    );
  };

  return (
    <>
      <Styled.Container>
        <Link href={`/home`} className="mb-5 text-rose-600">
          &lt; Back to home
        </Link>
        <Styled.HeaderRow>
          <Styled.Header>Attendance Management</Styled.Header>
          <Button className="bg-red-500 hover:bg-red-200" onClick={endEvent}>
            End Event
          </Button>
        </Styled.HeaderRow>
        {/* <Styled.HeaderRow>
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
        </Styled.HeaderRow> */}

        <Styled.Search
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

export default EventAttendance;
