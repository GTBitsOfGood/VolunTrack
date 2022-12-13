import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Button } from "reactstrap";
import EventTable from "../../../components/EventTable";
import { fetchAttendanceByUserId, getCurrentUser } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";
import { getHours } from "./hourParsing";
import * as SForm from "../../sharedStyles/formStyles";
import { Field, Formik } from "formik";
import { Row, Col } from "reactstrap";

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
  Right: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 0vw;
  `,
  Button: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 7.5rem;
    height: 3rem;
    margin-top: 2rem;
    margin-bottom: 2vw;

    &:focus {
      background: white;
      outline: none;
      border: none;
    }
  `,
  Events: styled.div`
    text-align: left;
    font-size: 36px;
    font-weight: bold;
  `,
  Margin: styled.div``,
  Content: styled.div`
    width: 60%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    align-items: start;
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
  marginTable: styled.div`
    margin-left: 0px;
  `,
  Box: styled.div`
    height: 250px;
    width: 725px;
    background-color: white;
    border: 1px solid ${variables["gray-200"]};
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  `,
  BoxInner: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 5px;
    padding-left: 20px;
  `,
  StatText: styled.div`
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    padding: 3px;
  `,
  StatImage: styled.div``,
  Hours: styled.div`
    margin-bottom: 2rem;
  `,
};

const StatDisplay = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [length, setLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [name, setName] = useState("");
  const [attend, setAttend] = useState("Bronze");
  const [earn, setEarn] = useState("Bronze");
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");

  if (!userId) {
    const { data: session } = useSession();
    userId = session.user._id;
  }

  const filterEvents = (eventsToFilter, start, end) => {
    let result = [];
    if (start === "undefined" && end === "undefined") {
      return eventsToFilter;
    } else if (start === "undefined") {
      for (const event of eventsToFilter) {
        if (event.timeCheckedOut <= end) {
          result.push(event);
        }
      }
    } else if (end === "undefined") {
      for (const event of eventsToFilter) {
        if (event.timeCheckedIn >= start) {
          result.push(event);
        }
      }
    } else {
      for (const event of eventsToFilter) {
        if (event.timeCheckedIn >= start && event.timeCheckedOut <= end) {
          result.push(event);
        }
      }
    }
    return result;
  };

  const onSubmitValues = (values, setSubmitting) => {
    if (!values.startD) {
      setStartDate("undefined");
    } else {
      setStartDate(new Date(values.startD).toISOString());
    }

    if (!values.endD) {
      setEndDate("undefined");
    } else {
      setEndDate(new Date(values.endD).toISOString());
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAttendanceByUserId(userId)
      .then((result) => {
        if (result && result.data && result.data.event) {
          const filteredEvents = filterEvents(
            result.data.event,
            startDate,
            endDate
          );
          setEvents(filteredEvents);
          setLength(filteredEvents.length);

          if (filteredEvents.length > 1) {
            setAttend("Silver");
          }
          if (filteredEvents.length > 3) {
            setAttend("Gold");
          }
          let add = 0;
          // HAVE TO FIX THIS
          for (let i = 0; i < filteredEvents.length; i++) {
            if (filteredEvents[i].timeCheckedOut != null) {
              add += getHours(
                filteredEvents[i].timeCheckedIn.slice(11, 16),
                filteredEvents[i].timeCheckedOut.slice(11, 16)
              );
            }
          }
          setSum(add);
          if (add >= 7) {
            setEarn("Silver");
          }
          if (add >= 14) {
            setEarn("Gold");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });

    getCurrentUser(userId)
      .then((result) => {
        if (result) {
          setName(
            result.data.result[0].bio.first_name +
              " " +
              result.data.result[0].bio.last_name +
              "'s"
          );
        }
      })
      .finally(() => {});
  }, [startDate, endDate]);

  return (
    <Styled.Container>
      <Styled.Right>
        <Styled.Header>{name} Volunteer Statistics</Styled.Header>
        <Styled.Header2>ACHIEVEMENTS</Styled.Header2>
        <Styled.Box>
          <Styled.BoxInner>
            <Styled.StatText>Events Attended</Styled.StatText>
            <Styled.StatImage>
              {loading ? (
                "Loading... "
              ) : (
                <img
                  src={"/images/Events Attended - " + attend + ".png"}
                  alt="helping-mamas-photo"
                  width="150px"
                  height="150px"
                />
              )}
            </Styled.StatImage>
            <Styled.StatText>{events.length} events</Styled.StatText>
          </Styled.BoxInner>

          <Styled.BoxInner>
            <Styled.StatText>Hours Earned</Styled.StatText>
            <Styled.StatImage>
              {loading ? (
                "Loading... "
              ) : (
                <img
                  src={"/images/Hours Earned - " + earn + ".png"}
                  id="earned"
                  alt="helping-mamas-photo"
                  width="150px"
                  height="150px"
                />
              )}
            </Styled.StatImage>
            <Styled.StatText>{Math.round(sum * 10) / 10} hours</Styled.StatText>
          </Styled.BoxInner>
        </Styled.Box>
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
                  <Field name="startD">
                    {({ field }) => (
                      <SForm.Input {...field} type="datetime-local" />
                    )}
                  </Field>
                </Col>
                <Col>
                  <SForm.Label>To</SForm.Label>

                  <Field name="endD">
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
        <Styled.Header>Volunteer History</Styled.Header>
        <Styled.Header2>{length} events</Styled.Header2>
        <Styled.marginTable>
          <EventTable events={events} isVolunteer={true} />
        </Styled.marginTable>

        <Styled.Margin></Styled.Margin>
      </Styled.Right>
    </Styled.Container>
  );
};
StatDisplay.propTypes = {
  user: PropTypes.object,
};

export default StatDisplay;
