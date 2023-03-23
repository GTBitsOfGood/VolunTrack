import { Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import { Col, ModalBody, ModalFooter, Row } from "reactstrap";
import BoGButton from "../../../../components/BoGButton";
import styled from "styled-components";
import { updateAttendance } from "../../../../actions/queries";
import * as SForm from "../../../sharedStyles/formStyles";
import { timeValidator } from "../eventHelpers";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled.div.attrs({
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
    >
      {({ handleSubmit, isValid, isSubmitting, errors, touched, values }) => {
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
                              <SForm.Input {...field} type="time" step="1" />
                            )}
                          </Field>
                          {errors.checkin &&
                            (touched.checkin || touched.checkout) && (
                              <Styled.ErrorMessage>
                                {errors.checkin}
                              </Styled.ErrorMessage>
                            )}
                        </Styled.Col>
                        <Styled.Col>
                          <SForm.Label>Check Out Time</SForm.Label>
                          <Field name="checkout">
                            {({ field }) => (
                              <SForm.Input {...field} type="time" step="1" />
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
              <BoGButton text="Cancel" onClick={toggle} outline={true} />
              <BoGButton
                text="Update"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
              />
            </ModalFooter>
          </>
        );
      }}
    </Formik>
  );
};

EditEventStatsForm.propTypes = {
  event: PropTypes.object,
  toggle: PropTypes.func.isRequired,
};

export default EditEventStatsForm;
