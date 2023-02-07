import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React, { useRef, useState, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Col,
  FormGroup,
  Input,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import styled from "styled-components";
import { createEvent, editEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import * as SForm from "../../sharedStyles/formStyles";
import { groupEventValidator, standardEventValidator } from "./eventHelpers";
import { RequestContext } from "../../../providers/RequestProvider";

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
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
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

const EventFormModal = ({ toggle, event, isGroupEvent, setEvent }) => {
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [isValidForCourtHours, setIsValidForCourtHours] = useState(
    event?.isValidForCourtHours ?? false
  );
  const {
    data: { user },
  } = useSession();
  const context = useContext(RequestContext);

  const onSubmitCreateEvent = (values, setSubmitting) => {
    const event = {
      ...values,
      isValidForCourtHours,
      description: content,
      isPrivate: isGroupEvent,
      userId: user._id,
    };
    setSubmitting(true);

    createEvent(event)
      .then(() => toggle())
      .catch((error) => {
        if (error.response.status !== 200) {
          context.startLoading();
          let message =
            error.response.data.errors[0].msg +
            " for " +
            error.response.data.errors[0].param;
          context.failed(message);
        }
      })
      .finally(() => setSubmitting(false));
  };

  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedEvent = {
      ...values,
      isValidForCourtHours,
      description: content,
      _id: event._id,
      userId: user._id,
    };
    setSubmitting(true);
    editEvent(editedEvent, sendConfirmationEmail);
    if (setEvent) {
      setEvent(editedEvent);
    }
    toggle();
  };

  const containsExistingEvent = (event) => {
    return event;
  };

  const onSendConfirmationEmailCheckbox = () => {
    setSendConfirmationEmail(!sendConfirmationEmail);
  };

  const onCourtRequiredHoursCheckbox = () => {
    setIsValidForCourtHours(!isValidForCourtHours);
  };

  const getLocalTime = () => {
    return new Date()
      .toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "short" })
      .substring(4);
  };

  const emptyStringField = "";
  const submitText = containsExistingEvent(event) ? "Save" : "Create Event";
  const [content, setContent] = useState(
    containsExistingEvent(event) ? event.description : emptyStringField
  );

  // eslint-disable-next-line no-unused-vars
  const [press, setPressed] = useState(false);

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  // const [errorArray, setErrors] = useState([])

  // const setTouched = ({ errors, touched }) => {
  //   const requi = []
  //   if (errors.title && touched.title) {
  //     requi.push("Title")
  //     setErrors("title")
  //   }
  // };
  //

  return (
    <Formik
      initialValues={{
        title: containsExistingEvent(event) ? event.title : emptyStringField,
        date: containsExistingEvent(event)
          ? event.date.split("T")[0]
          : emptyStringField, // strips timestamp
        startTime: containsExistingEvent(event)
          ? event.startTime
          : emptyStringField,
        endTime: containsExistingEvent(event)
          ? event.endTime
          : emptyStringField,
        localTime: containsExistingEvent(event)
          ? event.localTime
          : getLocalTime(),
        address: containsExistingEvent(event)
          ? event.address
          : emptyStringField,
        city: containsExistingEvent(event) ? event.city : emptyStringField,
        state: containsExistingEvent(event) ? event.state : "TN",
        zip: containsExistingEvent(event) ? event.zip : emptyStringField,
        max_volunteers: containsExistingEvent(event)
          ? event.max_volunteers
          : emptyStringField,
        description: containsExistingEvent(event)
          ? event.description
          : emptyStringField,

        // TODO: add default values for these
        eventContactPhone: containsExistingEvent(event)
          ? event.eventContactPhone
          : emptyStringField,
        eventContactEmail: containsExistingEvent(event)
          ? event.eventContactEmail
          : emptyStringField,

        pocName:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocName
            : emptyStringField,
        pocEmail:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocEmail
            : emptyStringField,
        pocPhone:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocPhone
            : emptyStringField,
        orgName:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgName
            : emptyStringField,
        orgAddress:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgAddress
            : emptyStringField,
        orgCity:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgCity
            : emptyStringField,
        orgState:
          containsExistingEvent(event) && isGroupEvent ? event.orgState : "GA",
        orgZip:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgZip
            : emptyStringField,
        isPrivate: isGroupEvent,
      }}
      onSubmit={(values, { setSubmitting }) => {
        containsExistingEvent(event)
          ? onSubmitEditEvent(values, setSubmitting)
          : onSubmitCreateEvent(values, setSubmitting);
      }}
      validationSchema={
        isGroupEvent ? groupEventValidator : standardEventValidator
      }
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
                        <SForm.Label>
                          Title<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="title">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="title" />
                      </Styled.Col>
                      <Styled.ThirdCol>
                        <SForm.Label>
                          Max Volunteers<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="max_volunteers">
                          {({ field }) => (
                            <SForm.Input {...field} type="number" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="max_volunteers" />
                      </Styled.ThirdCol>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>
                          Date<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="date">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="date" />
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>
                          Start Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="startTime" />
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>
                          End Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="endTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="endTime" />
                      </Styled.Col>
                      <Row />
                    </Row>
                    <Row
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Location
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>
                          Address<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="address">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="address" />
                      </Styled.Col>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>
                          City<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="city">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="city" />
                      </Styled.Col>
                      <Styled.FifthCol>
                        <SForm.Label>
                          State<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="state">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="state" />
                      </Styled.FifthCol>
                      <Styled.ThirdCol>
                        <SForm.Label>
                          Zip Code<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="zip">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="zip" />
                      </Styled.ThirdCol>
                    </Row>
                    <Row
                      style={{
                        // paddingLeft: "5.2rem",
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Contact
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>
                          Phone Number<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="eventContactPhone">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="eventContactPhone" />
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>
                          Email Address<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="eventContactEmail">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="eventContactEmail" />
                      </Styled.Col>
                    </Row>
                  </Col>
                  {isGroupEvent && (
                    <Col>
                      <Row
                        style={{
                          marginLeft: "0.5rem",
                          padding: "5px",
                        }}
                      >
                        <SForm.Label>Organization Information</SForm.Label>
                      </Row>
                      <div
                        style={{
                          backgroundColor: "#F4F4F4",
                          marginLeft: "1rem",
                          marginRight: "-2rem",
                          padding: "1rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        <Row>
                          <Styled.Col>
                            <SForm.Label>
                              Name<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="orgName">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="orgName" />
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>
                              Address<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="orgAddress">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="orgAddress" />
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>
                              City<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="orgCity">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="orgCity" />
                          </Styled.Col>
                          <Styled.FifthCol>
                            <SForm.Label>
                              State<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="orgState">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="orgState" />
                          </Styled.FifthCol>
                          <Styled.ThirdCol>
                            <SForm.Label>
                              Zip Code<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="orgZip">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="orgZip" />
                          </Styled.ThirdCol>
                        </Row>
                        <Row
                          style={{
                            padding: "5px",
                            fontWeight: "bold",
                            color: "gray",
                          }}
                        >
                          <Styled.Col>Point of Contact</Styled.Col>
                          &nbsp;
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>
                              Name<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>

                            <Field name="pocName">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="pocName" />
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>
                              Phone Number<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>
                            <Field name="pocPhone">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="pocPhone" />
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>
                              Email Address<Styled.RedText>*</Styled.RedText>
                            </SForm.Label>
                            <Field name="pocEmail">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="pocEmail" />
                          </Styled.Col>
                        </Row>
                      </div>
                    </Col>
                  )}
                </Row>
                <Row
                  style={{
                    marginRight: "-2rem",
                  }}
                >
                  <Styled.Col>
                    <SForm.Label>Description</SForm.Label>

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
                    <Styled.ErrorMessage name="description" />
                  </Styled.Col>
                </Row>
              </SForm.FormGroup>
            </Styled.Form>
            <SForm.Label>Other</SForm.Label>
            <Styled.Row>
              <FormGroup>
                <Input
                  defaultChecked={isValidForCourtHours}
                  type="checkbox"
                  onChange={onCourtRequiredHoursCheckbox}
                />
                <Styled.GenericText>
                  This event can count towards volunteer&apos;s court required
                  hours
                </Styled.GenericText>
                {containsExistingEvent(event) && (
                  <div>
                    <Input
                      type="checkbox"
                      onChange={onSendConfirmationEmailCheckbox}
                    />
                    <Styled.GenericText>
                      I would like to send an email to volunteers with updated
                      information
                    </Styled.GenericText>
                  </div>
                )}
              </FormGroup>
            </Styled.Row>
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
              onClick={() => {
                handleSubmit();
                setPressed(true);
              }}
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
  event: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  isGroupEvent: PropTypes.bool.isRequired,
  setEvent: PropTypes.func.isRequired,
};

export default EventFormModal;
