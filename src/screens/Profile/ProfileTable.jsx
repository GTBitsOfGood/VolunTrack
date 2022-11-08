import PropTypes from "prop-types";
import React from "react";
import {
  ModalBody,
  Container,
  Button,
  Col,
  Row,
} from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../sharedStyles/formStyles";
import * as Table from "../sharedStyles/tableStyles";

import styled from "styled-components";
import { updateUser } from "../../actions/queries";
import { capitalizeFirstLetter } from "../../screens/Profile/helpers";
import { profileValidator } from "./helpers";

const Styled = {
  Form: styled(FForm)``,
  Button: styled(Button)`
    background: white;
    border: none;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.ul`
    list-style-type: none;
  `,
  List: styled.li`
    padding-bottom: 120px;
  `,
  HeaderContainer: styled.div`
    margin-bottom: 2rem;
  `,
};
class ProfileTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: true,
      user: props.user,
      first_name: "",
      last_name: "",
      phone_number: 0,
      date_of_birth: 0,
      zip_code: 0,
      total_hours: 0,
      address: "",
      city: "",
      state: "",
      court_hours: "",
      notes: "",
      visibleText: false,
    };
  }

  handleSubmit = async (values) => {
    this.setState({
      visibleText: true,
    });
    await updateUser(
      this.props.user.bio.email,
      values.first_name,
      values.last_name,
      values.phone_number,
      values.date_of_birth,
      values.zip_code,
      values.total_hours,
      values.address,
      values.city,
      values.state,
      values.court_hours,
      values.notes
    );
    this.props.context.startLoading();
    this.props.context.success("Profile successfully updated!");
  };

  render() {
    const { isAdmin } = this.props.isAdmin;

    return (
      <React.Fragment>
        <Formik
          initialValues={{
            first_name: this.state.user.bio
              ? this.state.user.bio.first_name
              : "",
            last_name: this.state.user.bio ? this.state.user.bio.last_name : "",
            email: this.state.user.bio ? this.state.user.bio.email : "",
            phone_number: this.state.user.bio
              ? this.state.user.bio.phone_number
              : "",
            date_of_birth: this.state.user.bio
              ? this.state.user.bio.date_of_birth
              : "",
            zip_code: this.state.user.bio ? this.state.user.bio.zip_code : "",
            total_hours: this.state.user.bio
              ? this.state.user.bio.total_hours
              : "",
            address: this.state.user.bio ? this.state.user.bio.address : "",
            city: this.state.user.bio ? this.state.user.bio.city : "",
            state: this.state.user.bio ? this.state.user.bio.state : "",
            court_hours: this.state.user.bio
              ? this.state.user.bio.court_hours
              : "",
            notes: this.state.user.bio ? this.state.user.bio.notes : "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.handleSubmit(values);
            setSubmitting(true);
          }}
          validationSchema={profileValidator}
          render={({
            handleSubmit,
            isValid,
            isSubmitting,
            values,
            setFieldValue,
            handleBlur,
            errors,
            touched,
          }) => (
            <React.Fragment>
              <Table.Container
                style={{ width: "50%", maxWidth: "none", padding: "3rem" }}
              >
                <Container>
                  {this.state.user && (
                    <ModalBody>
                      <Styled.HeaderContainer>
                        <p
                          style={{
                            margin: "0px",
                            color: "#7F1C3B",
                            width: "240px",
                            "font-size": "24px",
                            "font-weight": "800",
                          }}
                        >{`${this.state.user.bio?.first_name} ${this.state.user.bio?.last_name}`}</p>
                        <p style={{ margin: "0px" }}>{`${capitalizeFirstLetter(
                          this.state.user.role ?? ""
                        )}`}</p>
                      </Styled.HeaderContainer>
                      <form>
                        <SForm.FormGroup>
                          <Row>
                            <Col>
                              <SForm.Label>First Name</SForm.Label>
                              <Field name="first_name">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="first_name" />
                            </Col>
                            <Col>
                              <SForm.Label>Last Name</SForm.Label>
                              <Field name="last_name">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="last_name" />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <SForm.Label>Email</SForm.Label>
                              <Field name="email">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="email" />
                            </Col>
                            <Col>
                              <SForm.Label>Phone</SForm.Label>
                              <Field name="phone_number">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="phone_number" />
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              <SForm.Label>Date of Birth</SForm.Label>
                              <Field name="date_of_birth">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="date_of_birth" />
                            </Col>
                            <Col>
                              <SForm.Label>Zip Code</SForm.Label>
                              <Field name="zip_code">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="zip_code" />
                            </Col>
                            <Col>
                              <SForm.Label>Total Hours</SForm.Label>
                              <Field
                                name="total_hours"
                                disabled={this.state.disable}
                              >
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="total_hours" />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <SForm.Label>Address</SForm.Label>
                              <Field name="address">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="address" />
                            </Col>
                            <Col>
                              <SForm.Label>City</SForm.Label>
                              <Field name="city">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="city" />
                            </Col>
                            <Col>
                              <SForm.Label>State</SForm.Label>
                              <Field name="state">
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="state" />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <SForm.Label>Court Required Hours</SForm.Label>
                              <Field name="court_hours" disabled={true}>
                                {({ field }) => (
                                  <SForm.Input {...field} type="text" />
                                )}
                              </Field>
                              <Styled.ErrorMessage name="court_hours" />
                            </Col>
                            {isAdmin && (
                              <Col>
                                <SForm.Label>Notes</SForm.Label>
                                <Field name="notes">
                                  {({ field }) => (
                                    <SForm.Input {...field} type="text" />
                                  )}
                                </Field>
                                <Styled.ErrorMessage name="notes" />
                              </Col>
                            )}
                          </Row>
                          <Row
                            style={{
                              "margin-top": "1.5rem",
                            }}
                          >
                            <Col></Col>
                            <Button
                              style={{ backgroundColor: "#ef4e79" }}
                              onClick={handleSubmit}
                              disabled={!isValid || isSubmitting}
                            >
                              Update
                            </Button>
                          </Row>
                        </SForm.FormGroup>
                      </form>
                    </ModalBody>
                  )}
                </Container>
              </Table.Container>
            </React.Fragment>
          )}
        />
      </React.Fragment>
    );
  }
}

export default ProfileTable;

ProfileTable.propTypes = {
  user: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  editUserCallback: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
