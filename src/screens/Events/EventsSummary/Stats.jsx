import { Formik } from "formik";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { fetchEvents, getEventStatistics } from "../../../actions/queries";
import { useEffect } from "react";
import EventTable from "../../../components/EventStatsTable";
import { Col, Row } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import styled from "styled-components";
import Loading from "../../../components/Loading";
import { useSession } from "next-auth/react";
import InputField from "../../../components/Forms/InputField";
import AdminAuthWrapper from "../../../utils/AdminAuthWrapper";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  marginTable: styled.div`
    margin-left: 0px;
    margin-top: 1rem;
  `,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  Header: styled.div`
    font-size: 27px;
    font-weight: bold;
    padding: 5px;
  `,
  StatHeader: styled.div`
    font-size: 15px;
    text-align: center;
    font-weight:
    padding: 1px;
  `,
  OverallStat: styled.div`
    font-size: 23px;
    text-align: center;
    padding: 1px;
  `,
  Header2: styled.div`
    font-size: 20px;
    color: dark-gray;
    font-weight: bold;
    padding: 5px;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  StatRow: styled(Row)`
    margin: 0.3rem 1rem 0.3rem 0.5rem;
    bottom: 0;
  `,
};

const Stats = () => {
  const [computedStats, setComputedStats] = useState([]);
  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  let user = session.user;

  useEffect(() => {
    onRefresh();
  }, [startDate, endDate]);

  const onRefresh = async () => {
    // grab the events
    setLoading(true);
    fetchEvents(startDate, endDate, user.organizationId)
      .then(async (result) => {
        if (result?.data?.events) setNumEvents(result.data.events.length);

        getEventStatistics(startDate, endDate).then((stats) => {
          let computedStats = [];
          var totalAttendance = 0;
          var totalHours = 0;
          for (let event of result.data.events) {
            let stat = stats.data.find((s) => s._id === event._id);
            if (stat) {
              totalAttendance += stat.uniqueUsers.length;
              totalHours += stat.minutes / 60.0;

              computedStats.push({
                _id: event._id,
                title: event.title,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                attendance: stat.uniqueUsers.length,
                hours: Math.round((stat.minutes / 60.0) * 100) / 100,
              });
            }
          }

          setAttend(totalAttendance);
          setHours(Math.round(totalHours * 100) / 100);
          setComputedStats(computedStats);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();
    if (!values.startDate) {
      setStartDate("undefined");
    } else {
      let start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      let end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }
  };

  return (
    <Styled.Container>
      <Styled.Header>Event Attendance Summary</Styled.Header>
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitValues(values, setSubmitting);
        }}
        render={({ handleSubmit }) => (
          <React.Fragment>
            <Row>
              <Col>
                <InputField
                  label="From"
                  name="startDate"
                  type="datetime-local"
                />
              </Col>
              <Col>
                <InputField label="To" name="endDate" type="datetime-local" />
              </Col>
            </Row>
            <Row>
              <Col>
                <BoGButton
                  text="Search"
                  onClick={() => {
                    handleSubmit();
                  }}
                />
              </Col>
            </Row>
          </React.Fragment>
        )}
      />
      <Styled.Header2>Statistics</Styled.Header2>
      {loading && <Loading />}

      {!loading && (
        <>
          <Styled.StatRow>
            <Col>
              <Styled.StatHeader>
                <br></br>Total Events:
              </Styled.StatHeader>
              <Styled.OverallStat>{numEvents}</Styled.OverallStat>
            </Col>
            <Col>
              <Styled.StatHeader>Total Attendance:</Styled.StatHeader>{" "}
              <Styled.OverallStat>{attend}</Styled.OverallStat>
            </Col>
            <Col>
              <Styled.StatHeader>Total Hours Worked:</Styled.StatHeader>
              <Styled.OverallStat>{hours}</Styled.OverallStat>
            </Col>
          </Styled.StatRow>
        </>
      )}

      {!loading && (
        <Styled.marginTable>
          <EventTable events={computedStats} isVolunteer={false} />
        </Styled.marginTable>
      )}
    </Styled.Container>
  );
};

export default AdminAuthWrapper(Stats);
