import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ModalBody, ModalFooter, Button, Col, Row } from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";
import { updateAttendance } from "../../../../actions/queries";

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

const EditEventStatsForm = ({ toggle, event }) => {
  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedEvent = {
      ...event
    };
    editedEvent.timeCheckedIn = event.timeCheckedIn.slice(0, 11) + values.checkin + ":00.000Z";
    editedEvent.timeCheckedOut =event.timeCheckedOut.slice(0, 11) + values.checkout + ":00.000Z";
    setSubmitting(true);
    updateAttendance(event._id, editedEvent);
    toggle();
  };

  return (
    <Formik
      initialValues={{
        name: event.name,
        email: event.email,
        checkin: event.timeCheckedIn,
        checkout: event.timeCheckedOut,
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmitEditEvent(values, setSubmitting);
      }}
      render={({
        handleSubmit,
        isValid,
        isSubmitting,
        values,
        setFieldValue,
        handleBlur,
      }) => (
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
                        <Styled.ErrorMessage name="checkin" />
                        <Field name="checkin">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Check Out Time</SForm.Label>
                        <Styled.ErrorMessage name="checkout" />
                        <Field name="checkout">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
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
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EditEventStatsForm;
