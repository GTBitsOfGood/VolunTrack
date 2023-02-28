import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import * as SForm from "../../screens/sharedStyles/formStyles";
import { Field, Formik, Form } from "formik";

// TODO ITEMS
/*
*  [v] Pass in the state displayEditUserModal
*  [v] Implement for a volunteer
*  [ ] Implement for an admin (maybe with authentification)
*  [ ] Implement for a profile edit
*  [ ] Make sure the scope of the props is narrow/broad enough
*  [ ] Change Forms to use the new InputField component
*  [ ] Hide the role drop down everywhere
*  [ ] Ask Question About the point below
*  -- Only allow edits to edit profile and edit volunteer (you can pass in a boolean and disable all the fields if true)
*/

const EditUserForm = ({
    userSelectedForEdit,
    submitHandler,
    isOpen,
    closeModal,
}) => {
    return (
<Formik
  enableReinitialize
  initialValues={userSelectedForEdit}
  onSubmit={submitHandler}
>
  <Modal style={{ maxWidth: "750px" }} isOpen={isOpen}>
    <Form>
      <ModalHeader color="#ef4e79">
        {userSelectedForEdit?.name ?? ""}
      </ModalHeader>
      <Container>
        <ModalBody>
          <SForm.FormGroup>
            <Row>
              <Col>
                <SForm.Label>First Name</SForm.Label>
                <Field name="first_name">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
              <Col>
                <SForm.Label>Last Name</SForm.Label>
                <Field name="last_name">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col>
                <SForm.Label>Email</SForm.Label>
                <Field name="email">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
              <Col>
                <SForm.Label>Phone</SForm.Label>
                <Field name="phone_number">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
            </Row>

            <Row>
              <Col>
                <SForm.Label>Date of Birth</SForm.Label>
                <Field name="date_of_birth">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
              <Col>
                <SForm.Label>Zip Code</SForm.Label>
                <Field name="zip_code">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col>
                <SForm.Label>Address</SForm.Label>
                <Field name="address">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
              <Col>
                <SForm.Label>City</SForm.Label>
                <Field name="city">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
              <Col>
                <SForm.Label>State</SForm.Label>
                <Field name="state">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col>
                <SForm.Label>Notes</SForm.Label>
                <Field name="notes">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </Col>
            </Row>
          </SForm.FormGroup>
        </ModalBody>
      </Container>
      <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" style={{ backgroundColor: "#ef4e79" }}>
          Update
        </Button>
      </ModalFooter>
    </Form>
  </Modal>
</Formik>
);
}

EditUserForm.propTypes = {
    userSelectedForEdit: PropTypes.object.isRequired,
    submitHandler: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
};

export default EditUserForm;