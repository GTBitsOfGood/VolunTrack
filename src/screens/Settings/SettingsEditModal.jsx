import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import styled from "styled-components";
import { updateUser } from "../../actions/queries";
import * as SForm from "../sharedStyles/formStyles";
import { eventValidator } from "./settingsHelper";

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

const handleChange = () => {};

const SettingsEditModal = ({ open, toggle }) => {
  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Edit Information</ModalHeader>

      <Formik
        /* set these initial values to the current user data */
        initialValues={{
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dateOfBirth: "",
          zipCode: "",
          address: "",
          city: "",
          state: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          updateUser(
            "james@jameswang.com",
            values.firstName,
            values.lastName,
            values.phoneNumber,
            values.dateOfBirth,
            values.zipCode,
            values.address,
            values.city,
            values.state
          );
          window.location.reload();
        }}
        validationSchema={eventValidator}
        render={({ handleSubmit, isValid, isSubmitting }) => (
          <React.Fragment>
            <ModalBody>
              <Styled.Form>
                <SForm.FormGroup>
                  <SForm.Label>First name</SForm.Label>
                  <Styled.ErrorMessage name="firstName" />
                  <Field name="firstName">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>Last name</SForm.Label>
                  <Styled.ErrorMessage name="lastName" />
                  <Field name="lastName">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>Phone number</SForm.Label>
                  <Styled.ErrorMessage name="phoneNumber" />
                  <Field name="phoneNumber">
                    {({ field }) => <SForm.Input {...field} type="text" />}
                  </Field>

                  <SForm.Label>Waiver</SForm.Label>
                  <Styled.ErrorMessage name="waivers" />
                  <Field name="waivers" onChange={handleChange}>
                    {({ field }) => (
                      <SForm.Input
                        {...field}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                      />
                    )}
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
SettingsEditModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default SettingsEditModal;
