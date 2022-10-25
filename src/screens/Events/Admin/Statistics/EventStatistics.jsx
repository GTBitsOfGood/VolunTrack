import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getAttendanceForEvent } from "../../../../actions/queries";
import EventTable from "../../../../components/EventTable";
import styled from "styled-components";
import EventStatsDeleteModal from "./EventStatsDeleteModal";
import EditEventStats from "./EditEventStats";

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
  TotalHours: styled.p`
    margin: 0;

    font-size: 2rem;
    vertical-align: top;
  `,
};

const EventStatistics = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const [attendanceStats, setAttendanceStats] = useState([]);

  const onRefresh = () => {
    getAttendanceForEvent(eventId).then((result) => {
      setAttendanceStats(result.data);
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const hours = attendanceStats.reduce((prev, curr) => prev + curr.hours, 0.0);
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
  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
    onRefresh();
  };

  return (
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>Statistics</Styled.Header>
        <Styled.TotalHours>
          {hours.toString().slice(0, 5)} Total Hours
        </Styled.TotalHours>
      </Styled.HeaderRow>
      <EventTable
        events={attendanceStats}
        isVolunteer={false}
        onDeleteClicked={onDeleteClicked}
        onEditClicked={onEditClicked}
      />
      <EditEventStats
        open={showEditModal}
        toggle={toggleEditModal}
        event={currEvent}
      />
      <EventStatsDeleteModal
        open={showDeleteModal}
        toggle={toggleDeleteModal}
        event={currEvent}
      />
    </Styled.Container>
  );
};

export default EventStatistics;
