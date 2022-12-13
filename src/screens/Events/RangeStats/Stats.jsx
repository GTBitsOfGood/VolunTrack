import { Field, Form as FForm, Formik } from "formik";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  fetchEvents,
  getSimpleAttendanceForEvent,
} from "../../../actions/queries";
import EventTable from "../../../components/EventStatsTable";
import { useEffect } from "react";
import { getHours } from "../../Stats/User/hourParsing";
import {
  Button,
  Col,
  Row,
} from "reactstrap";
import styled from "styled-components";
import * as SForm from "../../sharedStyles/formStyles";
import Loading from "../../../components/Loading";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
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
  Header2: styled.div`
    font-size: 14px;
    color: gray;
    padding: 5px;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const Stats = () => {
  const [events, setEvents] = useState([]);
  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRefresh();
  }, [startDate, endDate]);

  const onRefresh = async () => {
    setLoading(true);
    fetchEvents(startDate, endDate)
      .then(async (result) => {
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
          setNumEvents(result.data.events.length);

          let count = 0;
          for (let i = 0; i < events.length; i++) {
            await updateAttendance(events[i]._id);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  async function updateAttendance(eventID) {
    getSimpleAttendanceForEvent(eventID).then((result) => {
      setAttend(attend + result.data.length);
    });
  }

  const onSubmitValues = (values) => {
    if (values.startDate == null && startDate !== "undefined") {
      setStartDate("undefined");
    } else {
      setStartDate(new Date(values.startDate).toISOString());
    }

    if (values.endDate == null && endDate !== "undefined") {
      setEndDate("undefined");
    } else {
      setEndDate(new Date(values.endDate).toISOString());
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
                <SForm.Label>From</SForm.Label>
                <Field name="startDate">
                  {({ field }) => (
                    <SForm.Input {...field} type="datetime-local" />
                  )}
                </Field>
              </Col>
              <Col>
                <SForm.Label>To</SForm.Label>

                <Field name="endDate">
                  {({ field }) => (
                    <SForm.Input {...field} type="datetime-local" />
                  )}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => {
                    handleSubmit();
                  }}
                  style={{
                    backgroundColor: "ef4e79",
                    borderColor: "ef4e79",
                    marginBottom: "1rem",
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
      />
      <Styled.Header2>Statistics</Styled.Header2>
      {loading && <Loading />}

      {!loading && (
        <Row>
          <Col>Total Events: {numEvents}</Col>
          <Col>Total Attendance: {attend}</Col>
          <Col>Total Hours Worked: {hours}</Col>
        </Row>
      )}
      {/*{!loading && (*/}
      {/*  <Styled.marginTable>*/}
      {/*    <EventTable events={events} isVolunteer={false} />*/}
      {/*  </Styled.marginTable>*/}
      {/*)}*/}
    </Styled.Container>
  );
};

export default Stats;
