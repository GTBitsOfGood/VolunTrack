import { Field, Formik } from "formik";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  fetchAttendanceByUserId,
  fetchEvents,
  getSimpleAttendanceForEvent,
  getEventStatistics,
} from "../../../actions/queries";
import { useEffect } from "react";
import EventTable from "../../../components/EventStatsTable";
//import { getHours } from "../../Stats/User/hourParsing";
import { Button, Col, Row } from "reactstrap";
import styled from "styled-components";
import * as SForm from "../../sharedStyles/formStyles";
import Loading from "../../../components/Loading";
import { filterAttendance } from "../../Stats/helper";

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
  const [events, setEvents] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [loading, setLoading] = useState(false);

  const getHours = (startTime, endTime) => {
    var timeStart = new Date("01/01/2007 " + startTime);
    var timeEnd = new Date("01/01/2007 " + endTime);

    let hours = Math.abs(timeEnd - timeStart) / 36e5;

    if (hours < 0) {
      hours = 24 + hours;
    }

    return Math.round(hours * 10) / 10.0;
  };

  useEffect(() => {
    onRefresh();
  }, [startDate, endDate]);

  const onRefresh = async () => {
    setLoading(true);
    console.log("hello3");
    // grab the events
    setLoading(true);
    fetchEvents(startDate, endDate)
      .then(async (result) => {
        if (result && result.data && result.data.events) {
          setNumEvents(result.data.events.length);
        }
        console.log("ONE HERE");
        console.log(result);

        console.log("DATE HERE");
        console.log(startDate);
        console.log(endDate);
        console.log(new Date(startDate));
        console.log(new Date(endDate));
        getEventStatistics(startDate, endDate).then((result2) => {
          setEventStats(result2);
          console.log("TWO HERE");
          console.log(result);

          let returnArray = [];
          var totalAttendance = 0;
          var totalHours = 0;
          for (let document of result.data.events) {
            //let currEvent = []

            //let hours = getHours(event.timeCheckedIn.substring(11), event.timeCheckedOut.substring(11))
            var eventID = document._id;
            var attendance = 0;
            var hours = 0;

            for (let document of result2.data) {
              if (document._id == eventID) {
                attendance = document.num;
                totalAttendance += document.num;
                hours = document.hours;
                totalHours += document.hours;
              }
            }

            const newDoc = {
              _id: document._id,
              title: document.title,
              date: document.date,
              startTime: document.startTime,
              endTime: document.endTime,
              attendance: attendance,
              hours: hours,
            };

            returnArray.push(newDoc);
          }

          setAttend(totalAttendance);
          setHours(totalHours);
          setEvents(returnArray);
          console.log("THREE HERE");
          console.log(returnArray);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();
    //console.log("hello45678888")
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
          <EventTable events={events} isVolunteer={false} />
        </Styled.marginTable>
      )}
    </Styled.Container>
  );
};

export default Stats;
