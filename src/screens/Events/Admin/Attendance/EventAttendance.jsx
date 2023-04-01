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
import Footer from "./Footer";
import Text from "../../../../components/Text";

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

  const [event, setEvent] = useState({});
  const [minors, setMinors] = useState({});

  const [searchValue, setSearchValue] = useState("");

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

      setCheckedInVolunteers(
        (await getEventVolunteersByAttendance(eventId, true)).data.volunteers
      );
      setCheckedOutVolunteers(
        (await getEventVolunteersByAttendance(eventId, false)).data.volunteers
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
        <Styled.HeaderRow>
          <Text className="mb-4" href={`/events`} text="< Back to home" />
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
          placeholder="Search by Volunteer Name or Email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <AttendanceFunctionality
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
      <Footer endEvent={endEvent} reopenEvent={reopenEvent} event={event} />
    </>
  );
};

export default EventAttendance;
