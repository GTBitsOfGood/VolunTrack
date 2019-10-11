import React from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Formik, Form as FForm, Field } from 'formik';
import * as SForm from '../shared/formStyles';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const Styled = {
  Form: styled(FForm)``,
  DayPickerWrapper: styled.div`
    .DayPickerInput input {
      border: 1px solid ${props => props.theme.grey8};
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
      margin-bottom: 1rem;
      margin-top: 0.1rem;
    }
  `
};

const EventCreateModal = ({ open, toggle }) => {
  const handleSubmit = () => {};

  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Event</ModalHeader>
      <Formik
        initialValues={{
          name: '',
          date: new Date(),
          location: '',
          description: '',
          contact_phone: '',
          contact_email: '',
          max_volunteers: 0,
          external_links: []
        }}
        onSubmit={() => {
          console.log('submit');
        }}
        render={({ handleSubmit }) => (
          <React.Fragment>
            <ModalBody>
              <Styled.Form>
                <SForm.FormGroup>
                  <SForm.Label>Name</SForm.Label>
                  <Field name="name">{({ field }) => <SForm.Input {...field} type="text" />}</Field>
                  <SForm.Label>Date</SForm.Label>
                  <Field name="date">
                    {({ field }) => (
                      <Styled.DayPickerWrapper>
                        <DayPickerInput
                          {...field}
                          inputProps={{ ...field, className: 'form-control' }}
                        />
                      </Styled.DayPickerWrapper>
                    )}
                  </Field>
                  <SForm.Label>Description</SForm.Label>
                  <Field name="description">
                    {({ field }) => <SForm.Input {...field} type="textarea" />}
                  </Field>
                  <SForm.Label>Contact Phone</SForm.Label>
                  <Field name="contact_phone">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
                  <SForm.Label>Contact Email</SForm.Label>
                  <Field name="contact_email">
                    {({ field }) => <SForm.Input {...field} type="email" />}
                  </Field>
                  <SForm.Label>Max # of Volunteers</SForm.Label>
                  <Field name="max_volunteers ">
                    {({ field }) => <SForm.Input {...field} type="number" />}
                  </Field>
                </SForm.FormGroup>
              </Styled.Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
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
