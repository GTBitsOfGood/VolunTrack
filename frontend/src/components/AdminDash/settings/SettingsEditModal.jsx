import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Formik, Form as FForm, Field, ErrorMessage, useFormik } from 'formik';
import * as SForm from '../shared/formStyles';
import PropTypes from 'prop-types';
import { eventValidator } from './settingsHelper';
import { updateUser } from 'components/AdminDash/queries';
import { getCurrentUser } from 'components/AdminDash/queries';

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

//???????????????
const adminUser = () => {
  getCurrentUser().then(result => {
    if (result.data.users[0].role === "admin") { return true }
    return false;
  });
}

const handleChange = (event) => {
  
}

const SettingsEditModal = ({ open, toggle }) => {

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Edit Information</ModalHeader>

      <Formik
      /* set these initial values to the current user data */
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: '',
          street_address: '',
          city: '',
          state: '',
          zip_code: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(typeof(values.city))
          setSubmitting(true);
          updateUser("james@jameswang.com", values.firstName, values.lastName, values.city, values.zip_code, values.street_address, values.state, values.phoneNumber)
          window.location.reload()
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
                  <Field name="lastName" >{({ field }) => <SForm.Input {...field} type="text" />}</Field>
                  
                  <SForm.Label>Phone number</SForm.Label>
                  <Styled.ErrorMessage name="phoneNumber" />
                  <Field name="phoneNumber">
                    {({ field }) => <SForm.Input {...field} type="text" />}
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

                  {adminUser &&
                  <>
                  <SForm.Label>Waivers</SForm.Label>
                  <Styled.ErrorMessage name="waivers" />
                  <Field name="waivers" onChange={handleChange}>
                    {({ field }) => <SForm.Input {...field} type="file" />}
                  </Field>
                  </>
                  }

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