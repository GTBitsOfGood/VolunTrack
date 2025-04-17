import React, { useState } from "react";
import styled from "styled-components";
import { Modal, ModalHeader, ModalFooter, Input, FormGroup } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import variables from "../../../design-tokens/_variables.module.scss";
import InputField from "../../../components/Forms/InputField";
import { minorNameValidator } from "../eventHelpers";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MainText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0rem;
  `,
  Text: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
};

const EventMinorModal = ({ open, toggle, event, addMinor }) => {
  const minor = {
    firstName: "",
    lastName: "",
  };
  const [checked, setCheck] = useState(false);

  const close = () => {
    toggle();
  };

  const toggleCheck = (e) => {
    setCheck(e.target.checked);
  };

  return (
    <Formik
      initialValues={{
        firstName: minor.firstName,
        lastName: minor.lastName,
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        if (checked) {
          addMinor(values.firstName, values.lastName);
        }
        resetForm();
        toggle();
      }}
      validationSchema={minorNameValidator}
      render={({ handleSubmit, isValid, isSubmitting }) => (
        <React.Fragment>
          <Modal
            isOpen={open}
            toggle={toggle}
            background="static"
            size="lg"
            centered="true"
          >
            <Styled.ModalHeader>
              <Styled.MainText>Add Minor</Styled.MainText>
            </Styled.ModalHeader>
            <SForm.FormGroup>
              <div className="flex flex-col px-4 pt-4">
                <div className="flex flex-row justify-center">
                  <InputField
                    className="mr-4 w-5/12"
                    name="firstName"
                    placeholder="First Name"
                    label="First Name"
                  />
                  <InputField
                    className="w-5/12"
                    name="lastName"
                    label="Last Name"
                    placeholder="Last Name"
                  />
                </div>
                <div className="ml-12 flex flex-row pt-2">
                  <FormGroup check className="pr-3">
                    <Input
                      type="checkbox"
                      checked={checked}
                      onClick={(e) => {
                        toggleCheck(e);
                      }}
                    />{" "}
                  </FormGroup>
                  <Styled.Text>
                    This volunteer is under the age of 16
                  </Styled.Text>
                </div>
              </div>
            </SForm.FormGroup>
            <ModalFooter>
              <BoGButton text="Cancel" onClick={close} outline={true} />
              <BoGButton
                text="Add"
                disabled={!checked || !isValid || isSubmitting}
                onClick={handleSubmit}
              />
            </ModalFooter>
          </Modal>
        </React.Fragment>
      )}
    />
  );
};

EventMinorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  addMinor: PropTypes.func.isRequired,
};
export default EventMinorModal;
