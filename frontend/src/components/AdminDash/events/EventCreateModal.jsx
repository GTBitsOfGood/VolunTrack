import React from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as SForm from '../shared/formStyles';
import PropTypes from 'prop-types';
import { eventValidator } from './eventHelpers';
import { createEvent } from '../queries';

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: 'span'
  })`
    ::before {
      content: '*';
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `
};

const EventCreateModal = ({ open, toggle }) => {
  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Create Event</ModalHeader>
      <Formik
        initialValues={{
          name: '',
          date: '',
          location: '',
          description: '',
          contact_phone: '',
          contact_email: '',
          max_volunteers: 0,
          external_links: []
        }}
        onSubmit={(values, { setSubmitting }) => {
          const event = {
            ...values,
            contact_phone: values.contact_phone || undefined,
            contact_email: values.contact_email || undefined,
            external_links: values.external_links ? [values.external_links] : undefined
          };
          setSubmitting(true);
          createEvent(event)
            .then(() => toggle())
            .catch(console.log)
            .finally(() => setSubmitting(false));
        }}
        validationSchema={eventValidator}
        render={({ handleSubmit, isValid, isSubmitting, values, setFieldValue, handleBlur }) => (
          <React.Fragment>
            <ModalBody>
              <Styled.Form>
                <SForm.FormGroup>
                  <SForm.Label>Name</SForm.Label>
                  <Styled.ErrorMessage name="name" />
                  <Field name="name">{({ field }) => <SForm.Input {...field} type="text" />}</Field>
                  <SForm.Label>Date</SForm.Label>
                  <Styled.ErrorMessage name="date" />
                  <Field name="date">{({ field }) => <SForm.Input {...field} type="date" />}</Field>
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
                  <SForm.Label>External Link</SForm.Label>
                  <Styled.ErrorMessage name="external_links" />
                  <Field name="external_links">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
                  <SForm.Label>Max # of Volunteers</SForm.Label>
                  <Styled.ErrorMessage name="max_volunteers" />
                  <SForm.Input
                    type="number"
                    name="max_volunteers"
                    value={values.max_volunteers}
                    onBlur={handleBlur}
                    onChange={e => {
                      if (e.target.value && !isNaN(parseInt(e.target.value, 10))) {
                        setFieldValue('max_volunteers', parseInt(e.target.value, 10));
                      } else {
                        setFieldValue('max_volunteers', e.target.value);
                      }
                    }}
                  />
                </SForm.FormGroup>
              </Styled.Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
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
  toggle: PropTypes.func
};

export default EventCreateModal;
