import { Label } from "flowbite-react";
import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useContext, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Col, FormGroup, Input, ModalBody, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import { toFormikValidationSchema } from "zod-formik-adapter";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import variables from "../../../design-tokens/_variables.module.scss";
import { RequestContext } from "../../../providers/RequestProvider";
import { createEvent, editEvent } from "../../../queries/events";
import { eventPopulatedInputValidator } from "../../../validators/events";
import * as SForm from "../../sharedStyles/formStyles";
import { groupEventValidator } from "./eventHelpers";

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
      date: values.date,
      eventParent: values.eventParent,
    };
    setSubmitting(true);

    createEvent(event)
      .then(() => toggle())
      .catch((error) => {
        if (error.response.status !== 200) {
          context.startLoading();
          context.failed(error.response.data.message);
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
        date: event?.date ? event.date.split("T")[0] : "",
        eventParent: {
          title: event?.eventParent?.title ?? "",
          startTime: event?.eventParent?.startTime ?? "",
          endTime: event?.eventParent?.endTime ?? "",
          localTime: event?.eventParent?.localTime ?? "",
          address: event?.eventParent?.address ?? "",
          city: event?.eventParent?.city ?? "",
          state: event?.eventParent?.state ?? "",
          zip: event?.eventParent?.zip ?? "",
          eventContactPhone: event?.eventParent?.eventContactPhone ?? "",
          eventContactEmail: event?.eventParent?.eventContactEmail ?? "",
          maxVolunteers: event?.eventParent?.maxVolunteers ?? 1,
          isPrivate: event?.eventParent?.isPrivate ?? isGroupEvent,
          isValidForCourtHours:
            event?.eventParent?.isValidForCourtHours ?? false,
          organizationId:
            event?.eventParent?.organizationId ?? user.organizationId,
          pocName: isGroupEvent ? event?.eventParent?.pocName ?? "" : "",
          pocEmail: isGroupEvent ? event?.eventParent?.pocEmail ?? "" : "",
          pocPhone: isGroupEvent ? event?.eventParent?.pocPhone ?? "" : "",
          orgName: isGroupEvent ? event?.eventParent?.orgName ?? "" : "",
          orgAddress: isGroupEvent ? event?.eventParent?.orgAddress ?? "" : "",
          orgCity: isGroupEvent ? event?.eventParent?.orgCity ?? "" : "",
          orgState: isGroupEvent ? event?.eventParent?.orgState ?? "" : "",
          orgZip: isGroupEvent ? event?.eventParent?.orgZip ?? "" : "",
          description: event?.eventParent?.description ?? "",
        },
      }}
      onSubmit={(values, { setSubmitting }) => {
        containsExistingEvent(event)
          ? onSubmitEditEvent(values, setSubmitting)
          : onSubmitCreateEvent(values, setSubmitting);
      }}
      validationSchema={
        isGroupEvent
          ? groupEventValidator
          : toFormikValidationSchema(eventPopulatedInputValidator)
      }
    >
      {({ values, errors, handleSubmit, isValid, isSubmitting }) => {
        return (
          <>
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
                          <InputField
                            label="Title"
                            isRequired={true}
                            name="eventParent.title"
                          />
                        </Styled.Col>
                        <Styled.ThirdCol>
                          <InputField
                            label="Max Volunteers"
                            isRequired={true}
                            name="eventParent.maxVolunteers"
                            type="number"
                          />
                        </Styled.ThirdCol>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Date"
                            isRequired={true}
                            name="date"
                            type="date"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="Start Time"
                            isRequired={true}
                            name="eventParent.startTime"
                            type="time"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="End Time"
                            isRequired={true}
                            name="eventParent.endTime"
                            type="time"
                          />
                        </Styled.Col>
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
                          <InputField
                            label="Address"
                            isRequired={true}
                            name="eventParent.address"
                            type="text"
                          />
                        </Styled.Col>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="City"
                            isRequired={true}
                            name="eventParent.city"
                            type="text"
                          />
                        </Styled.Col>
                        <Styled.FifthCol>
                          <InputField
                            label="State"
                            isRequired={true}
                            name="eventParent.state"
                            type="text"
                          />
                        </Styled.FifthCol>
                        <Styled.ThirdCol>
                          <InputField
                            label="Zip Code"
                            isRequired={true}
                            name="eventParent.zip"
                            type="text"
                          />
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
                          <InputField
                            label="Phone Number"
                            isRequired={true}
                            name="eventParent.eventContactPhone"
                            type="tel"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="Email Address"
                            isRequired={true}
                            name="eventParent.eventContactEmail"
                            type="email"
                          />
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
                              <InputField
                                label="Name"
                                isRequired={true}
                                name="eventParent.orgName"
                                type="text"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Address"
                                isRequired={true}
                                name="eventParent.orgAddress"
                                type="text"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="City"
                                isRequired={true}
                                name="eventParent.orgCity"
                                type="text"
                              />
                            </Styled.Col>
                            <Styled.FifthCol>
                              <InputField
                                label="State"
                                isRequired={true}
                                name="eventParent.orgState"
                                type="text"
                              />
                            </Styled.FifthCol>
                            <Styled.ThirdCol>
                              <InputField
                                label="Zip Code"
                                isRequired={true}
                                name="eventParent.orgZip"
                                type="text"
                              />
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
                              <InputField
                                label="Name"
                                isRequired={true}
                                name="eventParent.pocName"
                                type="text"
                              />
                            </Styled.Col>
                            <Styled.Col>
                              <InputField
                                label="Phone Number"
                                isRequired={true}
                                name="eventParent.pocPhone"
                                type="tel"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Email Address"
                                isRequired={true}
                                name="eventParent.pocEmail"
                                type="email"
                              />
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
                      <div className="flex flex-row">
                        <Label class="mb-1 h-6 font-medium text-slate-600">
                          Description
                        </Label>
                      </div>

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
              <div className="flex flex-row">
                <Label class="mb-1 h-6 font-medium text-slate-600">Other</Label>
              </div>
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
              <BoGButton text="Cancel" onClick={toggle} outline={true} />
              <BoGButton
                text={submitText}
                onClick={() => {
                  handleSubmit();
                  setPressed(true);
                }}
                disabled={!isValid || isSubmitting}
              />
            </ModalFooter>
          </>
        );
      }}
    </Formik>
  );
};

EventFormModal.propTypes = {
  event: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  isGroupEvent: PropTypes.bool.isRequired,
  setEvent: PropTypes.func.isRequired,
};

export default EventFormModal;
