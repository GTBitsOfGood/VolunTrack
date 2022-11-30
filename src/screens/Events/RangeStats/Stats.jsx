
import { useSession } from "next-auth/react";
import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { fetchEvents, getSimpleAttendanceForEvent } from "../../../actions/queries";
import EventTable from "../../../components/EventStatsTable";
import { useEffect } from "react";
import { getHours } from "../../Stats/User/hourParsing";
import {
  Button,
  Col,
  FormGroup,
  Input,
  ModalBody,
  ModalFooter,
  Row,
  Form,
} from "reactstrap";
import styled from "styled-components";
import { createEvent, editEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import * as SForm from "../../sharedStyles/formStyles";
// import { groupEventValidator, standardEventValidator } from "./eventHelpers";


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
    margin-top: 1rem;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
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
  FifthCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 20%;
  `,
  ThirdCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 33%;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  GenericText: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  RedText: styled.i`
    color: red;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  Errors: styled.div`
    background-color: #f3f3f3;
    border-radius: 6px;
    max-width: 350px;
    padding: 8px;
  `,
  ErrorBox: styled.ul`
    margin: 0rem 2rem 0.5rem 1rem;
  `,
};

const Stats = () => {

  const [events, setEvents] = useState([]);
  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const onRefresh = () => {
    setLoading(true);
    //console.log("hello")
    fetchEvents(startDate, endDate)
      .then((result) => {
        //console.log(result)
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
          setNumEvents(result.data.events.length);

          let count = 0;
          for (let i = 0; i < events.length; i++) {
            updateAttendance(events[i]._id)
            
          }
          //setAttend(count);
          //console.log(events);
          //console.log("hello1")
        }
      })
      .finally(() => {
        setLoading(false);
        //console.log("hello3")
      });
      //console.log("hello2")
  };

  async function updateAttendance(eventID) {
    getSimpleAttendanceForEvent(eventID) 
      .then((result) => {
        console.log("here")
        console.log(attend)
        setAttend(attend + result.data.length)
        console.log(attend)
    });
  };
 
  const onSubmitValues = (values, setSubmitting) => {

    //console.log("hi")
    //console.log(values);
    if (values.startD == null) {
      setStartDate("undefined");
    } else {
      setStartDate(new Date(values.startD));
    }

    if(values.endD == null) {
      setEndDate("undefined")
    } else {
      setEndDate(new Date(values.endD));      
    }
    
    //console.log(startDate)
    
    onRefresh();
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const [successText, setSuccessText] = useState("");

  const {
    data: { user },
  } = useSession();
 
  return (<Styled.Container>

    <Styled.Header>
          Event Attendance Summary
        </Styled.Header> 

    <Formik
    initialValues={{
      
    }}
    
    onSubmit={(values, { setSubmitting }) => {
      
      onSubmitValues(values, setSubmitting);
    }}
    render={({
      handleSubmit,
      isValid,
      isSubmitting,
      values,
      setFieldValue,
      handleBlur,
      errors,
      touched,
    }) => (
      <React.Fragment>
        
        <Row>
          
                        <SForm.Label>
                          From
                        </SForm.Label>

                        <Field name="startD">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>

                     {/* <SForm.Label>
                          Start Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field> */}

                        <SForm.Label>
                          To
                        </SForm.Label>

                        <Field name="endD">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>

                        <Button
                          color="primary"
                          onClick={() => {
                            handleSubmit();
                          }}
                          style={{
                            backgroundColor: "ef4e79",
                            borderColor: "ef4e79",
                            // backgroundColor: variables["button-pink"],
                            // borderColor: variables["button-pink"],
                            
                            marginBottom: "1rem",
                          }}
                        >
                          Search
                        </Button>
                        </Row>

                        {/* <SForm.Label>
                          End Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="endTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field> */}
          
          
      </React.Fragment>
    )}
  />
  <SForm.Label>Statistics</SForm.Label>
  <Row>
    
  

  <Col>Total Events: {numEvents}</Col>
  <Col>Total Attendance: {attend}</Col>
  <Col>Total Hours Worked: {hours}</Col>
  </Row>
    <Styled.marginTable>
         <EventTable events={events} isVolunteer={false} />
    </Styled.marginTable>
  </Styled.Container>
  )
};

export default Stats;
