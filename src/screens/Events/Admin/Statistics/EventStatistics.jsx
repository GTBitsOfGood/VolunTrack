import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import StatsTable from "../../../../components/StatsTable";
import { getAttendances } from "../../../../queries/attendances";
import { getEvent } from "../../../../queries/events";
import { getRegistrations } from "../../../../queries/registrations";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
import EditEventStats from "./EditEventStats";
import EventStatsDeleteModal from "./EventStatsDeleteModal";
import { totalHours, formatDurationHours } from "../../../../../utils/hours";

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

  const [loadError, setLoadError] = useState("");
  const onRefresh = useCallback(async () => {
    if (typeof eventId !== "string") return false;
    try {
      const [attendanceResult, eventResult, registrationResult] =
        await Promise.all([
          getAttendances({ eventId }),
          getEvent(eventId),
          getRegistrations({ eventId }),
        ]);
      if (
        !attendanceResult?.data?.attendances ||
        !eventResult?.data?.event ||
        !registrationResult?.data?.registrations
      ) {
        throw new Error(
          "Statistics could not be refreshed. Reload the page to try again."
        );
      }
      setAttendances(attendanceResult.data.attendances);
      setEvent(eventResult.data.event);
      setRegistrations(registrationResult.data.registrations);
      setLoadError("");
      return true;
    } catch {
      setLoadError(
        "Statistics could not be refreshed. Reload the page to try again."
      );
      return false;
    }
  }, [eventId]);

  useEffect(() => {
    if (router.isReady && typeof eventId === "string") onRefresh();
  }, [router.isReady, eventId, onRefresh]);

  const hours = totalHours(attendances);
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
  const toggleEditModal = () => setShowEditModal(false);
  const onAttendanceSaved = async (savedAttendance) => {
    setAttendances((previous) =>
      previous.map((attendance) =>
        attendance._id === savedAttendance._id ? savedAttendance : attendance
      )
    );
    if (!(await onRefresh()))
      throw new Error("Statistics refresh failed after saving attendance.");
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
      {loadError && <p role="alert">{loadError}</p>}
      <Styled.StatsContainer>
        <Styled.StatsHeader>About this Event</Styled.StatsHeader>
        {event && (
          <Styled.StatsInfoContainer>
            <Styled.StatsInfo>
              <p>
                <strong>Total Members Attended: </strong>{" "}
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
                <strong>Total Hours: </strong> {formatDurationHours(hours)}
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
        event={event}
        onSaved={onAttendanceSaved}
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
