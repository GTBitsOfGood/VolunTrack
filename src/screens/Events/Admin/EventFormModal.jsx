import { Label } from "flowbite-react";
import { Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Col, FormGroup, Input, ModalBody, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { eventPopulatedInputClientValidator } from "../../../../server/mongodb/models/Event";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import Text from "../../../components/Text";
import { RequestContext } from "../../../providers/RequestProvider";
import { createEvent, updateEvent } from "../../../queries/events";
import * as SForm from "../../sharedStyles/formStyles";
import { getOrganization } from "../../../queries/organizations";

const Styled = {
  Form: styled(FForm)``,
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
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const EventFormModal = ({ toggle, event, isGroupEvent, setEvent }) => {
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [organization, setOrganization] = useState({});
  const [isValidForCourtHours, setIsValidForCourtHours] = useState(
    event?.eventParent?.isValidForCourtHours ?? false
  );
  const {
    data: { user },
  } = useSession();

  const context = useContext(RequestContext);

  useEffect(() => {
    async function fetchData() {
      const response = await getOrganization(user.organizationId);
      if (response.data.organization)
        setOrganization(response.data.organization);
    }
    fetchData();
  }, []);

  const onSubmitCreateEvent = (values, setSubmitting) => {
    const event = {
      date: values.date,
      eventParent: values.eventParent,
    };
    setSubmitting(true);
    if (isGroupEvent) event.eventParent.isPrivate = true;
    if (isValidForCourtHours) event.eventParent.isValidForCourtHours = true;

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
    values.eventParent.isValidForCourtHours = isValidForCourtHours;
    const editedEvent = {
      date: values.date,
      eventParent: values.eventParent,
    };
    setSubmitting(true);
    updateEvent(event._id, editedEvent, sendConfirmationEmail);
    if (setEvent) {
      event.date = values.date;
      event.eventParent = values.eventParent;
      setEvent(event);
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

  const submitText = containsExistingEvent(event) ? "Save" : "Create Event";

  // eslint-disable-next-line no-unused-vars
  const [press, setPressed] = useState(false);

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        date: event?.date ? event.date.split("T")[0] : "",
        eventParent: {
          title: event?.eventParent?.title ?? "",
          startTime: event?.eventParent?.startTime ?? "",
          endTime: event?.eventParent?.endTime ?? "",
          localTime: event?.eventParent?.localTime ?? "",
          address:
            event?.eventParent?.address ??
            organization.defaultEventAddress ??
            "",
          city: event?.eventParent?.city ?? organization.defaultEventCity ?? "",
          state:
            event?.eventParent?.state ?? organization.defaultEventState ?? "",
          zip: event?.eventParent?.zip ?? organization.defaultEventZip ?? "",
          eventContactPhone:
            event?.eventParent?.eventContactPhone ??
            organization.defaultContactPhone ??
            "",
          eventContactEmail:
            event?.eventParent?.eventContactEmail ??
            organization.defaultContactEmail ??
            "",
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
        // isGroupEvent
        //   ? groupEventValidator
        //   :
        toFormikValidationSchema(eventPopulatedInputClientValidator)
      }
    >
      {({ values, handleSubmit, isValid, isSubmitting, setFieldValue }) => {
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
                            fontWeight: "bold",
                            color: "gray",
                          }}
                        >
                          Organization Information
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
                              marginLeft: "-0.7rem",
                              fontWeight: "bold",
                              color: "gray",
                            }}
                          >
                            Point of Contact
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

                      <Field name="eventParent.description">
                        {() => (
                          <ReactQuill
                            value={values.eventParent.description}
                            onChange={(newValue) => {
                              setFieldValue(
                                "eventParent.description",
                                newValue
                              );
                            }}
                            ref={quill}
                          />
                        )}
                      </Field>
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
                  <Text
                    text="This event can count towards volunteer's court required
                    hours"
                  />
                  {containsExistingEvent(event) && (
                    <div>
                      <Input
                        type="checkbox"
                        onChange={onSendConfirmationEmailCheckbox}
                      />
                      <Text text="I would like to send an email to volunteers with updated information" />
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
