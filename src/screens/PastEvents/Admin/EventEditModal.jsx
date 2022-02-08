import React from "react";
import styled from "styled-components";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import { eventValidator } from "./eventHelpers";
import { editEvent } from "../../../actions/queries";

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
};

const EventEditModal = ({ open, toggle, event }) => {
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Event</ModalHeader>
      <Formik
        initialValues={{
          name: event ? event.name : "",
          date: event ? event.date.split("T")[0] : "", // strips timestamp
          location: event ? event.location : "",
          description: event ? event.description : "",
          contact_phone: event ? event.contact_phone : "",
          contact_email: event ? event.email : "",
          shifts: event ? event.shifts : [],
        }}
        onSubmit={(values, { setSubmitting }) => {
          const editedEvent = {
            ...values,
            contact_phone: values.contact_phone || undefined,
            contact_email: values.contact_email || undefined,
            _id: event._id,
          };
          setSubmitting(true);
          editEvent(editedEvent);
          toggle();
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
            <ModalBody>
              <Styled.Form>
                <SForm.FormGroup>
                  <SForm.Label>Name</SForm.Label>
                  <Styled.ErrorMessage name="name" />
                  <Field name="name">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
                  <SForm.Label>Date</SForm.Label>
                  <Styled.ErrorMessage name="date" />
                  <Field name="date">
                    {({ field }) => <SForm.Input {...field} type="date" />}
                  </Field>
                  <SForm.Label>Location</SForm.Label>
                  <Styled.ErrorMessage name="location" />
                  <Field name="location">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
                  <SForm.Label>Description</SForm.Label>
                  <Styled.ErrorMessage name="description" />
                  <Field name="description">
                    {({ field }) => <SForm.Input {...field} type="textarea" />}
                  </Field>
                  <SForm.Label>Contact Phone</SForm.Label>
                  <Styled.ErrorMessage name="contact_phone" />
                  <Field name="contact_phone">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
                  <SForm.Label>Contact Email</SForm.Label>
                  <Styled.ErrorMessage name="contact_email" />
                  <Field name="contact_email">
                    {({ field }) => <SForm.Input {...field} type="email" />}
                  </Field>
                </SForm.FormGroup>
              </Styled.Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
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
EventEditModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventEditModal;
