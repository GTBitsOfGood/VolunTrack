import React from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Formik, Form as FForm, Field, ErrorMessage, useFormik } from 'formik';
import * as SForm from '../shared/formStyles';
import PropTypes from 'prop-types';
import { eventValidator } from './settingsHelper';

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

const SettingsEditModal = ({ open, toggle }) => {
  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Edit Information</ModalHeader>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          city: '',
          state: '',
          zip_code: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          {/*CHANGE DATABASE HERE*/}
        }}
        validationSchema={eventValidator}
        render={({ handleSubmit, isValid, isSubmitting, values, setFieldValue, handleBlur }) => (
          <React.Fragment>
            <ModalBody>
              <Styled.Form>
                <SForm.FormGroup>

                  <SForm.Label>First name</SForm.Label>
                  <Styled.ErrorMessage name="firstName" />
                  <Field name="firstName">{({ field }) => <SForm.Input {...field} type="text" />}</Field>

                  <SForm.Label>Last name</SForm.Label>
                  <Styled.ErrorMessage name="lastName" />
                  <Field name="lastName">{({ field }) => <SForm.Input {...field} type="text" />}</Field>
                  
                  <SForm.Label>Phone number</SForm.Label>
                  <Styled.ErrorMessage name="phoneNumber" />
                  <Field name="phoneNumber">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>Email</SForm.Label>
                  <Styled.ErrorMessage name="email" />
                  <Field name="email">
                    {({ field }) => <SForm.Input {...field} type="email" />}
                  </Field>

                  <SForm.Label>City</SForm.Label>
                  <Styled.ErrorMessage name="city" />
                  <Field name="city">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>State</SForm.Label>
                  <Styled.ErrorMessage name="state" />
                  <Field name="state">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>Zip Code</SForm.Label>
                  <Styled.ErrorMessage name="zip_code" />
                  <Field name="zip_code">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>
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
SettingsEditModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func
};

export default SettingsEditModal;