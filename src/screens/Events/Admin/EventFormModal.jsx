import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Input,
  Col,
  Row,
} from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import { eventValidator } from "./eventHelpers";
import { editEvent } from "../../../actions/queries";
import { createEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import "react-quill/dist/quill.snow.css";
import { set } from "lodash";

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
    padding: 10px;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 5rem;
  `,
  GenericText: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const EventFormModal = ({ toggle, event, han, isGroupEvent }) => {
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);

  const onSubmitCreateEvent = (values, setSubmitting) => {
    const event = {
      ...values,
      description: content,
    };
    setSubmitting(true);
    createEvent(event)
      .then(() => toggle())
      .catch(console.log)
      .finally(() => setSubmitting(false));
  };

  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedEvent = {
      ...values,
      description: content,
      _id: event._id,
    };
    setSubmitting(true);
    editEvent(editedEvent, sendConfirmationEmail);
    toggle();
  };

  const containsExisitingEvent = (event) => {
    return event;
  };

  const onSendConfirmationEmailCheckbox = () => {
    setSendConfirmationEmail(true);
  };

  const emptyStringField = "";
  const submitText = containsExisitingEvent(event) ? "Submit" : "Create Event";
  const [content, setContent] = useState(
    containsExisitingEvent(event) ? event.description : emptyStringField
  );

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  return (
    <Formik
      initialValues={{
        title: containsExisitingEvent(event) ? event.title : emptyStringField,
        date: containsExisitingEvent(event)
          ? event.date.split("T")[0]
          : emptyStringField, // strips timestamp
        startTime: containsExisitingEvent(event)
          ? event.startTime
          : emptyStringField,
        endTime: containsExisitingEvent(event)
          ? event.endTime
          : emptyStringField,
        address: containsExisitingEvent(event)
          ? event.address
          : emptyStringField,
        city: containsExisitingEvent(event) ? event.city : emptyStringField,
        zip: containsExisitingEvent(event) ? event.zip : emptyStringField,
        max_volunteers: containsExisitingEvent(event)
          ? event.max_volunteers
          : emptyStringField,
        description: containsExisitingEvent(event)
          ? event.description
          : emptyStringField,
      }}
      onSubmit={(values, { setSubmitting }) => {
        containsExisitingEvent(event)
          ? onSubmitEditEvent(values, setSubmitting)
          : onSubmitCreateEvent(values, setSubmitting);
      }}
      validationSchema={eventValidator}
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
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Event Title</SForm.Label>
                        <Styled.ErrorMessage name="title" />
                        <Field name="title">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Date</SForm.Label>
                        <Styled.ErrorMessage name="date" />
                        <Field name="date">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Start Time</SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>End Time</SForm.Label>
                        <Field name="endTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Address</SForm.Label>
                        <Styled.ErrorMessage name="address" />
                        <Field name="address">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>City</SForm.Label>
                        <Styled.ErrorMessage name="city" />
                        <Field name="city">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Zipcode</SForm.Label>
                        <Styled.ErrorMessage name="zip" />
                        <Field name="zip">
                          {({ field }) => (
                            <SForm.Input {...field} type="number" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Max Number of Volunteers</SForm.Label>
                        <Styled.ErrorMessage name="max_volunteers" />
                        <Field name="max_volunteers">
                          {({ field }) => (
                            <SForm.Input {...field} type="number" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Description</SForm.Label>
                        <Styled.ErrorMessage name="description" />
                        <Field name="description">
                          {() => (
                            <ReactQuill
                              value={content}
                              onChange={(newValue) => {
                                setContent(newValue);
                              }}
                              ref={quill}
                            />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                  </Col>
                  {isGroupEvent && (
                    <Col>
                      <Row
                        style={{
                          marginLeft: "1rem",
                        }}
                      >
                        <SForm.Label>Organization Information</SForm.Label>
                      </Row>
                      <Row
                        style={{
                          backgroundColor: "#F4F4F4",
                          marginLeft: "1rem",
                          padding: "1rem",
                        }}
                      >
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Name</SForm.Label>
                            <Styled.ErrorMessage name="name" />
                            <Field name="name">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>POC Name</SForm.Label>
                            <Styled.ErrorMessage name="pocName" />
                            <Field name="pocName">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>POC Phone</SForm.Label>
                            <Field name="pocPhone">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>POC Email</SForm.Label>
                            <Field name="pocEmail">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Address Line 1</SForm.Label>
                            <Styled.ErrorMessage name="addressLineOne" />
                            <Field name="addressLineOne">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>City</SForm.Label>
                            <Styled.ErrorMessage name="orgCity" />
                            <Field name="orgCity">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>State</SForm.Label>
                            <Styled.ErrorMessage name="orgState" />
                            <Field name="orgState">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Address Line 2</SForm.Label>
                            <Styled.ErrorMessage name="addressLineTwo" />
                            <Field name="addressLineTwo">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>Zip Code</SForm.Label>
                            <Styled.ErrorMessage name="orgZip" />
                            <Field name="orgZip">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                      </Row>
                    </Col>
                  )}
                </Row>
              </SForm.FormGroup>
            </Styled.Form>
            {containsExisitingEvent(event) && (
              <Styled.Row>
                <FormGroup>
                  <Input
                    type="checkbox"
                    onChange={onSendConfirmationEmailCheckbox}
                  />
                  {""}
                </FormGroup>
                <Styled.GenericText>
                  I would like to send a confirmation email
                </Styled.GenericText>
              </Styled.Row>
            )}
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
              {submitText}
            </Button>
          </ModalFooter>
        </React.Fragment>
      )}
    />
  );
};

EventFormModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventFormModal;
