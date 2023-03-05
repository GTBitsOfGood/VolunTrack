import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
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
 */

const EditUserForm = (props) => {
  return (
    <Formik
      enableReinitialize
      initialValues={props.userSelectedForEdit}
      onSubmit={props.submitHandler}
    >
      <Form>
        <Container>
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
        </Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          {props.isModal && (
            <Button color="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
          )}
          <Button type="submit" style={{ backgroundColor: "#ef4e79" }}>
            Update
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

EditUserForm.propTypes = {
  userSelectedForEdit: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  isAdmin: PropTypes.bool.isRequired,
};

export default EditUserForm;