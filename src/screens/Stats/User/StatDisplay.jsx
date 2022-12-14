import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Button } from "reactstrap";
import EventTable from "../../../components/EventTable";
import {
  fetchAttendanceByUserId,
  getCurrentUser,
} from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";
import { getHours } from "./hourParsing";
import * as SForm from "../../sharedStyles/formStyles";
import { Field, Formik } from "formik";
import { Row, Col } from "reactstrap";
import { filterAttendance } from "../helper";

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
    margin: auto;
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
    @media (max-width: 768px) {
      font-size: 15px;
    }
  `,
  StatImage: styled.div``,
  Hours: styled.div`
    margin-bottom: 2rem;
  `,
};

const StatDisplay = ({ userId, onlyAchievements }) => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
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

  useEffect(() => {
    setLoading(true);
    fetchAttendanceByUserId(userId)
      .then((result) => {
        if (result && result.data && result.data.event) {
          const filteredAttendance = filterAttendance(
            result.data.event,
            startDate,
            endDate
          );
          setAttendance(filteredAttendance);
          setLength(filteredAttendance.length);

          if (filteredAttendance.length > 1) {
            setAttend("Silver");
          } else if (filteredAttendance.length > 3) {
            setAttend("Gold");
          }
          let add = 0;
          // HAVE TO FIX THIS
          for (let i = 0; i < filteredAttendance.length; i++) {
            if (filteredAttendance[i].timeCheckedOut != null) {
              add += getHours(
                filteredAttendance[i].timeCheckedIn.slice(11, 16),
                filteredAttendance[i].timeCheckedOut.slice(11, 16)
              );
            }
          }
          setSum(add);
          if (add >= 7) {
            setEarn("Silver");
          } else if (add >= 14) {
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

  let achievements = (
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
        <Styled.StatText>{attendance.length} events</Styled.StatText>
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
  );

  return (
    <React.Fragment>
      {!onlyAchievements && (
        <Styled.Container>
          <Styled.Right>
            <Styled.Header>{name} Volunteer Statistics</Styled.Header>
            <Styled.Header2>ACHIEVEMENTS</Styled.Header2>
            {achievements}

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
            <div>
              <Styled.Header>Volunteer History</Styled.Header>
              <Styled.Header2>{length} events</Styled.Header2>
              <Styled.marginTable>
                <EventTable events={attendance} isIndividualStats={true} />
              </Styled.marginTable>

              <Styled.Margin></Styled.Margin>
            </div>
          </Styled.Right>
        </Styled.Container>
      )}
      {onlyAchievements && achievements}
    </React.Fragment>
  );
};
StatDisplay.propTypes = {
  userId: PropTypes.string,
  onlyAchievements: PropTypes.bool,
};

export default StatDisplay;
