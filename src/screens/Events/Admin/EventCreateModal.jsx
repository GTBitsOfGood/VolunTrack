import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import * as Table from "../../sharedStyles/tableStyles";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Formik, Form as FForm, Field, FieldArray, ErrorMessage } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import { eventValidator } from "./eventHelpers";
import { createEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
  ModalHeader: styled(ModalHeader)`
    color: variables.primary;
  `
};

const EventCreateModal = ({ open, toggle }) => {
  const [shiftElements, setShiftElements] = useState([]);

  const onClickAddShifts = () => {
    setShiftElements([
      ...shiftElements,
      { start_time: "", end_time: "", max_volunteers: "" },
    ]);
  };

  const onDeleteShift = (index) => () => {
    if (shiftElements.length > 1) {
      let newArray = [];
      for (let i = 0; i < shiftElements.length; i++) {
        if (i !== index) {
          newArray.push(shiftElements[i]);
        }
      }
      setShiftElements(newArray);
    }
  };

  const onCancel = () => {
    setShiftElements([]);
    toggle();
  }

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="lg">
      <Styled.ModalHeader toggle={toggle} style={{ color: variables.dark }}>Standard Event</Styled.ModalHeader>
      <Formik
        initialValues={{
          name: "",
          date: "",
          location: "",
          description: "",
          contact_phone: "",
          contact_email: "",
          shifts: undefined,
        }}
        onSubmit={(values, { setSubmitting }) => {
          const event = {
            ...values,
            contact_phone: values.contact_phone || undefined,
            contact_email: values.contact_email || undefined,
            shifts: values.shifts ? shiftElements : undefined,
          };
          setSubmitting(true);
          createEvent(event)
            .then(() => toggle())
            .catch(console.log)
            .finally(() => setSubmitting(false));
          setShiftElements([]);
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
            <ModalBody style={{color: variables.dark}}>
              <Styled.Form>
                <SForm.FormGroup>
                  <Row>
                    <Col>
                      <SForm.Label>Event Title</SForm.Label>
                      <Styled.ErrorMessage name="title" />
                      <Field name="title">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    
                    <Col>
                      <SForm.Label>Date and Time</SForm.Label>
                      <Styled.ErrorMessage name="date" />
                      <Field name="date">
                        {({ field }) => <SForm.Input {...field} type="date" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label></SForm.Label>
                      <Field name="time">
                        {({ field }) => <SForm.Input {...field} type="time" />}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SForm.Label>Address</SForm.Label>
                      <Styled.ErrorMessage name="address" />
                      <Field name="address">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>City</SForm.Label>
                      <Styled.ErrorMessage name="city" />
                      <Field name="city">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>Zipcode</SForm.Label>
                      <Styled.ErrorMessage name="zip" />
                      <Field name="zip">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SForm.Label>Max Number of Volunteers</SForm.Label>
                      <Styled.ErrorMessage name="volunteers" />
                      <Field name="volunteers">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SForm.Label>Description</SForm.Label>
                      <Styled.ErrorMessage name="description" />
                      <Field name="description">
                        {({ field }) => <SForm.Input {...field} type="textarea" />}
                      </Field>
                    </Col>
                  </Row>
                  <FieldArray
                    name="shifts"
                    render={() =>
                      shiftElements.map((item, index) => (
                        <div key={index}>
                          <Table.Container>
                            <Table.Table>
                              <thead>
                                <tr>
                                  <SForm.Label>Start Time</SForm.Label>
                                  <Styled.ErrorMessage name={`Start Time`} />
                                  <Field name={`shifts.${index}.start_time`}>
                                    {({ field }) => (
                                      <SForm.Input
                                        {...field}
                                        type="time"
                                        onInput={(e) =>
                                          (shiftElements[index].start_time =
                                            e.target.value)
                                        }
                                        value={shiftElements[index].start_time}
                                      />
                                    )}
                                  </Field>
                                  <SForm.Label>End Time</SForm.Label>
                                  <Styled.ErrorMessage name={`End Time`} />
                                  <Field name={`shifts.${index}.end_time`}>
                                    {({ field }) => (
                                      <SForm.Input
                                        {...field}
                                        type="time"
                                        onInput={(e) =>
                                          (shiftElements[index].end_time =
                                            e.target.value)
                                        }
                                        value={shiftElements[index].end_time}
                                      />
                                    )}
                                  </Field>
                                  <SForm.Label>Max Volunteers</SForm.Label>
                                  <Styled.ErrorMessage
                                    name={`Max Volunteers`}
                                  />
                                  <Field
                                    name={`shifts.${index}.max_volunteers`}
                                  >
                                    {({ field }) => (
                                      <SForm.Input
                                        {...field}
                                        type="number"
                                        onInput={(e) =>
                                          (shiftElements[index].max_volunteers =
                                            e.target.value)
                                        }
                                        value={
                                          shiftElements[index].max_volunteers
                                        }
                                        min="0"
                                      />
                                    )}
                                  </Field>
                                </tr>
                              </thead>
                              <Button onClick={onDeleteShift(index)}>
                                <Icon color="grey3" name="delete" />
                              </Button>
                            </Table.Table>
                          </Table.Container>
                        </div>
                      ))
                    }
                  />
                  {/* <Button onClick={onClickAddShifts}> Add Shift </Button> */}
                </SForm.FormGroup>
              </Styled.Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                // style={{color: variables.secondary}}
              >
                Submit
              </Button>
            </ModalFooter>
          </React.Fragment>
        )}
      />
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
