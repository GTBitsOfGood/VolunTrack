import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import StatsTable from "../../../../components/StatsTable";
import { getAttendances } from "../../../../queries/attendances";
import { getEvent } from "../../../../queries/events";
import { getRegistrations } from "../../../../queries/registrations";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
import EditEventStats from "./EditEventStats";
import EventStatsDeleteModal from "./EventStatsDeleteModal";
import { getHours } from "../../../Stats/User/hourParsing";

const Styled = {
  Container: styled.div`
    width: 80%;
    height: 100%;
    align-self: center;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.h1`
    width: 100%;
    font-size: 3rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
  `,
  Table: styled.div`
    width: 100%;
    height: 50%;
    margin: 1rem 0;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  `,
  StatsContainer: styled.div`
    width: 50%;
    height: 50%;
    margin: 1rem 0rem;
    background: white;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      width: 100%;
    }
  `,
  StatsHeader: styled.h4`
    margin-bottom: 1rem;
  `,
  StatsInfoContainer: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;
    }
  `,
  StatsInfo: styled.div`
    display: flex;
    flex-direction: row;
  `,
};

const EventStatistics = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [attendances, setAttendances] = useState([]);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const onRefresh = () => {
    getAttendances({ eventId: eventId }).then((result) => {
      if (result.data) {
        setAttendances(result.data.attendances);
      }
    });
    getEvent(eventId).then((result) => {
      setEvent(result.data.event);
    });
    getRegistrations({ eventId }).then((result) => {
      setRegistrations(result.data.registrations);
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  let hours = 0;
  attendances.forEach((attendance) => {
    if (attendance.checkoutTime)
      hours += getHours(
        attendance.checkinTime.slice(11, 16),
        attendance.checkoutTime.slice(11, 16)
      );
  });
  const totalVolunteers = [
    ...new Set(attendances.map((attendance) => attendance.userId)),
  ];
  const [showEditModal, setShowEditModal] = useState(false);
  const [currAttendance, setCurrAttendance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onEditClicked = (event) => {
    setShowEditModal(true);
    setCurrAttendance(event);
  };
  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
    onRefresh();
  };
  const onDeleteClicked = (event) => {
    setShowDeleteModal(true);
    setCurrAttendance(event);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(false);
    onRefresh();
  };

  return (
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>Statistics</Styled.Header>
      </Styled.HeaderRow>
      <Styled.StatsContainer>
        <Styled.StatsHeader>About this Event</Styled.StatsHeader>
        {event && (
          <Styled.StatsInfoContainer>
            <Styled.StatsInfo>
              <p>
                <strong>Total Volunteers Attended: </strong>{" "}
                {totalVolunteers.length}
              </p>
            </Styled.StatsInfo>
            <Styled.StatsInfo>
              <p>
                <strong>Total Slots Filled: </strong>
                {registrations.length}
              </p>
            </Styled.StatsInfo>
            <Styled.StatsInfo>
              <p>
                <strong>Open Slots Remaining: </strong>
                {event.eventParent.maxVolunteers - registrations.length}
              </p>
            </Styled.StatsInfo>
          </Styled.StatsInfoContainer>
        )}
        {event && (
          <Styled.StatsInfoContainer>
            <Styled.StatsInfo>
              <p>
                <strong>Total Hours: </strong> {hours.toString().slice(0, 5)}
              </p>
            </Styled.StatsInfo>
          </Styled.StatsInfoContainer>
        )}
      </Styled.StatsContainer>
      <Styled.Table>
        <StatsTable
          attendances={attendances}
          isIndividualStats={false}
          onDeleteClicked={onDeleteClicked}
          onEditClicked={onEditClicked}
        />
      </Styled.Table>
      <EditEventStats
        open={showEditModal}
        toggle={toggleEditModal}
        attendance={currAttendance}
      />
      <EventStatsDeleteModal
        open={showDeleteModal}
        toggle={toggleDeleteModal}
        attendance={currAttendance}
      />
    </Styled.Container>
  );
};

export default AdminAuthWrapper(EventStatistics);
