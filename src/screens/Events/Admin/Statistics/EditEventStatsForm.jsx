import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, ModalBody, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import { object, string } from "yup";
import { updateAttendance } from "../../../../actions/queries";
import variables from "../../../../design-tokens/_variables.module.scss";
import * as SForm from "../../../sharedStyles/formStyles";

const Styled = {
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
    display: inline-block;
  `,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const timeValidator = object().shape({
  checkin: string().test(
    "times-correct",
    "checkin time needs to be before checkout time",
    (value, context) => value < context.parent.checkout
  ),
});

const EditEventStatsForm = ({ toggle, event }) => {
  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedEvent = {
      ...event,
    };
    editedEvent.timeCheckedIn = new Date(
      new Date(
        new Date(event.timeCheckedIn) - new Date().getTimezoneOffset() * 60_000
      )
        .toISOString()
        .slice(0, 11) + values.checkin
    ).toISOString();
    editedEvent.timeCheckedOut = new Date(
      new Date(
        new Date(event.timeCheckedOut) - new Date().getTimezoneOffset() * 60_000
      )
        .toISOString()
        .slice(0, 11) + values.checkout
    ).toISOString();
    setSubmitting(true);
    updateAttendance(event._id, editedEvent);
    toggle();
  };

  return (
    <Formik
      initialValues={{
        name: event.volunteerName,
        email: event.volunteerEmail,
        checkin: new Date(event.timeCheckedIn).toLocaleTimeString("en-GB"),
        checkout: new Date(event.timeCheckedOut).toLocaleTimeString("en-GB"),
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmitEditEvent(values, setSubmitting);
      }}
      validationSchema={timeValidator}
      render={({ handleSubmit, isValid, isSubmitting }) => (
        <React.Fragment>
          <Styled.ModalBody>
            <Styled.Form>
              <SForm.FormGroup>
                <Row>
                  <Col>
                    <Row
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Information
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Name</SForm.Label>
                        <Field name="name">
                          {({ field }) => (
                            <SForm.Input
                              {...field}
                              type="text"
                              disabled={true}
                            />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Email</SForm.Label>
                        <Field name="email">
                          {({ field }) => (
                            <SForm.Input
                              {...field}
                              type="text"
                              disabled={true}
                            />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Check In Time</SForm.Label>
                        <Field name="checkin">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="checkin" />
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Check Out Time</SForm.Label>
                        <Field name="checkout">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="checkout" />
                      </Styled.Col>
                    </Row>
                  </Col>
                </Row>
              </SForm.FormGroup>
            </Styled.Form>
          </Styled.ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={toggle}
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                color: variables["event-text"],
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={{
                backgroundColor: "ef4e79",
                borderColor: "ef4e79",
                // backgroundColor: variables["button-pink"],
                // borderColor: variables["button-pink"],
                marginLeft: "4rem",
              }}
            >
              Update
            </Button>
          </ModalFooter>
        </React.Fragment>
      )}
    />
  );
};

EditEventStatsForm.propTypes = {
  event: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default EditEventStatsForm;
