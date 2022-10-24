import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchEventsById } from "../../../../actions/queries";
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

  const [event, setEvent] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      const event = (await fetchEventsById(eventId)).data.event;
      setEvent(event);
    })();
  }, []);

  return (
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>Attendance</Styled.Header>
        <Styled.CheckedInData>
          <span style={{ fontWeight: "bold" }}>
            <span style={{ fontWeight: "bold", fontSize: "3rem" }}>
              {event?.volunteers.length}
            </span>
            <span style={{ fontWeight: "normal" }}>/</span>
            {event?.max_volunteers}
          </span>{" "}
          Checked In
        </Styled.CheckedInData>
      </Styled.HeaderRow>

      <Styled.Search
        placeholder="Search Last Name or Email"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {event && (
        <AttendanceFunctionality
          volunteerIds={event.volunteers}
          eventId={eventId}
        />
      )}
    </Styled.Container>
  );
};

export default EventAttendance;
