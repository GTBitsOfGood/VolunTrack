import { ErrorMessage, Field, Formik } from "formik";
import { signIn } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";
import { Col, FormGroup as BFormGroup, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../components/BoGButton";
import InputField from "../../components/Forms/InputField";
import { createUserFromCredentials } from "../../queries/users";
import * as SForm from "../sharedStyles/formStyles";
import { createAccountValidator, loginValidator } from "./helpers";

const Styled = {
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
  FormGroup: styled(BFormGroup)`
    width: 100%;
  `,
};

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    let url = new URL(window.location.href);

    if (url.searchParams.has("error")) {
      this.props.context.startLoading();
      this.props.context.failed("Your username or password is incorrect.");
    }
  }

  handleSubmit = async (values) => {
    if (this.props.createAccount) {
      createUserFromCredentials(values)
        .then(() => {
          signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: `${window.location.origin}/home`,
          });
        })
        .catch((error) => {
          if (error.response.status !== 200) {
            this.props.context.startLoading();
            this.props.context.failed(error.response.data);
          }
        });
    } else {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: `${window.location.origin}/home`,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirm: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.handleSubmit(values);
            setSubmitting(false);
          }}
          validationSchema={
            this.props.createAccount ? createAccountValidator : loginValidator
          }
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <div style={{ width: "100%" }}>
              <form>
                <Styled.FormGroup>
                  {/*<Row>*/}
                  {/*  <Field as="select" name="nonprofit">*/}
                  {/*    <option value="1">Helping Mamas</option>*/}
                  {/*    <option value="2">Nonprofit 2</option>*/}
                  {/*    <option value="3">Nonprofit 3</option>*/}
                  {/*  </Field>*/}
                  {/*</Row>*/}
                  {this.props.createAccount && (
                    <Row>
                      <Col>
                        <InputField
                          name="first_name"
                          placeholder="Frst Name"
                          label="First Name"
                        />
                        {/*<SForm.Label>First Name</SForm.Label>*/}
                        {/*<Field name="first_name">*/}
                        {/*  {({ field }) => (*/}
                        {/*    <SForm.Input*/}
                        {/*      {...field}*/}
                        {/*      type="text"*/}
                        {/*      placeholder="First Name"*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*</Field>*/}
                        {/*<Styled.ErrorMessage name="first_name" />*/}
                      </Col>
                      <Col>
                        <SForm.Label>Last Name</SForm.Label>
                        <Field name="last_name">
                          {({ field }) => (
                            <SForm.Input
                              {...field}
                              type="text"
                              placeholder="Last Name"
                            />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="last_name" />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col>
                      <SForm.Label>Email Address</SForm.Label>
                      <Field name="email">
                        {({ field }) => (
                          <SForm.Input
                            {...field}
                            type="text"
                            autoComplete="email"
                            placeholder="Your Email"
                          />
                        )}
                      </Field>
                      <Styled.ErrorMessage name="email" />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SForm.Label>Password</SForm.Label>
                      <Field name="password">
                        {({ field }) => (
                          <SForm.Input
                            {...field}
                            type="password"
                            autoComplete="current-password"
                            placeholder="Your Password"
                          />
                        )}
                      </Field>
                      <Styled.ErrorMessage name="password" />
                    </Col>
                  </Row>
                  {this.props.createAccount && (
                    <Row>
                      <Col>
                        <SForm.Label>Confirm Password</SForm.Label>
                        <Field name="password_confirm">
                          {({ field }) => (
                            <SForm.Input
                              {...field}
                              type="password"
                              placeholder="Your Password"
                            />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="password_confirm" />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <BoGButton
                      type="submit"
                      onClick={handleSubmit}
                      disabled={!isValid || isSubmitting}
                      text={
                        this.props.createAccount
                          ? "Create an account"
                          : "Sign In"
                      }
                    />
                  </Row>
                </Styled.FormGroup>
              </form>
            </div>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

export default AuthForm;

AuthForm.propTypes = {
  createAccount: PropTypes.bool,
  context: PropTypes.object.isRequired,
};
