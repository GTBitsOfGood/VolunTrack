import React, { useState } from "react";
import styled from "styled-components";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  Input,
  FormGroup,
} from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import PropTypes from "prop-types";
import { Col, Row, Container } from "reactstrap";
import { Formik, Field } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import variables from "../../../design-tokens/_variables.module.scss";

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
  HighlightText: styled.p`
    color: ${variables["dark"]};
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
  Container: styled(Container)`
    background-color: ${variables["success"]};
    border-radius: 0.1rem;
  `,
  ConfirmationModal: styled(Modal)`
    bottom: 0;
  `,
  BoldText: styled.span`
    font-weight: 900;
  `,
};

// Where is this modal too?
const EventMinorModal = ({ open, toggle, event, setHasMinorTrue }) => {
  const minor = {
    firstName: "",
    lastName: "",
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);

        if (checked && firstName !== "" && lastName !== "") {
          setHasMinorTrue(firstName, lastName);
        }
        setFirstName("");
        setLastName("");
        toggle();
      }}
      render={({ handleSubmit, isSubmitting, handleBlur }) => (
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
                  <Styled.Text>First Name</Styled.Text>
                  <Field name="firstName">
                    {({ field }) => (
                      <SForm.Input
                        {...field}
                        type="text"
                        onBlur={handleBlur}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    )}
                  </Field>
                </Styled.Col>
                <Styled.Col>
                  <Styled.Text>Last Name</Styled.Text>
                  <Field name="lastName">
                    {({ field }) => (
                      <SForm.Input
                        {...field}
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    )}
                  </Field>
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
              <BoGButton text="Cancel" onClick={close} />
              <BoGButton
                text="Add"
                disabled={!checked || firstName == "" || lastName == ""}
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
  setHasMinorTrue: PropTypes.func.isRequired,
};
export default EventMinorModal;
