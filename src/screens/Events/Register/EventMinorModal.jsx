import React, { useState } from "react";
import styled from "styled-components";
import { Modal, ModalHeader, ModalFooter, Input, FormGroup } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
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
  Col: styled(Col)`
    margin-top: 0.5rem;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
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
              <Styled.Row />
              <Styled.Row>
                <Styled.Col>
                  <InputField
                    name="firstName"
                    placeholder="First Name"
                    label="First Name"
                  />
                </Styled.Col>
                <Styled.Col>
                  <InputField
                    name="lastName"
                    label="Last Name"
                    placeholder="Last Name"
                  />
                </Styled.Col>
              </Styled.Row>
              <Styled.Row>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    checked={checked}
                    onClick={(e) => {
                      toggleCheck(e);
                    }}
                  />{" "}
                </FormGroup>
                <Styled.Text>This volunteer is under the age of 13</Styled.Text>
              </Styled.Row>
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
