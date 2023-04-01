import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BasicModal from "../../../../components/BasicModal";
import {
  fetchEventsById,
  getAttendanceForEvent,
} from "../../../../actions/queries";
import EventTable from "../../../../components/EventTable";
import EditEventStats from "./EditEventStats";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.h1`
    margin: 0 22rem;

    font-size: 3rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
  `,
  TotalHours: styled.p`
    margin: 0 2rem;

    font-size: 2rem;
    vertical-align: top;
  `,
  Table: styled.div`
    width: 50%;
    height: 50%;
    margin: 1rem 22.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  `,
  StatsContainer: styled.div`
    width: 50%;
    height: 50%;
    margin: 1rem 22.5rem;
    padding: 0.5rem;
    background: white;
    display: flex;
    flex-direction: column;
  `,
  StatsHeader: styled.h4`
    margin: 1rem 2rem;
  `,
  StatsInfoContainer: styled.div`
    margin: 0rem 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  StatsInfo: styled.div`
    display: flex;
    flex-direction: row;
  `,
};

const EventStatistics = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [event, setEvent] = useState(null);

  const onRefresh = () => {
    getAttendanceForEvent(eventId).then((result) => {
      let stats = result.data.map((stat) => {
        stat.hours = Math.round((stat.minutes / 60.0) * 100) / 100;
        return stat;
      });
      setAttendanceStats(stats);
    });
    fetchEventsById(eventId).then((result) => {
      setEvent(result.data.event);
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const hours = attendanceStats.reduce((prev, curr) => prev + curr.hours, 0.0);
  const totalVolunteers = [
    ...new Set(attendanceStats.map((attendance) => attendance.userId)),
  ];
  const [showEditModal, setShowEditModal] = useState(false);
  const [currEvent, setCurrEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onEditClicked = (event) => {
    setShowEditModal(true);
    setCurrEvent(event);
  };
  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
    onRefresh();
  };
  const onDeleteClicked = (event) => {
    setShowDeleteModal(true);
    setCurrEvent(event);
  };

  const confirmDeleteModal = () => {
    deleteAttendance(currEvent._id, currEvent.eventId)
      .then(() => {
        toggleDeleteModal();
      })
      .catch(console.log);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
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
                <strong>Total Slots Filled: </strong> {event.volunteers.length}
              </p>
            </Styled.StatsInfo>
            <Styled.StatsInfo>
              <p>
                <strong>Open Slots Remaining: </strong>{" "}
                {event.max_volunteers - event.volunteers.length}
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
        <EventTable
          events={attendanceStats}
          isIndividualStats={false}
          onDeleteClicked={onDeleteClicked}
          onEditClicked={onEditClicked}
        />
      </Styled.Table>
      <EditEventStats
        open={showEditModal}
        toggle={toggleEditModal}
        event={currEvent}
      />
      <BasicModal 
        open={showDeleteModal}
        title={`Are you sure you want to delete this entry ${<strong>permanently</strong>}?`}
        onConfirm={confirmDeleteModal}
        onCancel={toggleDeleteModal}
        cancelText={"Cancel"}
        confirmText={"Delete"}
      />
    </Styled.Container>
  );
};

export default AdminAuthWrapper(EventStatistics);
