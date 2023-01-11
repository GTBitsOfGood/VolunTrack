import { ErrorMessage, Field, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, FormGroup as BFormGroup, Row } from "reactstrap";
import * as SForm from "../sharedStyles/formStyles";

import styled from "styled-components";
import { createAccountValidator, loginValidator } from "./helpers";
import { signIn } from "next-auth/react";
import { createUserFromCredentials } from "../../actions/queries";

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
  }

  handleSubmit = async (values) => {
    if (this.props.createAccount) {
      let response = await createUserFromCredentials(values);
      console.log(response.data);

      if (response.status !== 200) {
        this.props.context.startLoading();
        // todo merge shweta's context ticket in
        this.props.context.failed(response.data);
      }
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: `${window.location.origin}/home`,
    });
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
            <form>
              <Styled.FormGroup>
                {this.props.createAccount && (
                  <Row>
                    <Col>
                      <SForm.Label>First Name</SForm.Label>
                      <Field name="first_name">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                      <Styled.ErrorMessage name="first_name" />
                    </Col>
                    <Col>
                      <SForm.Label>Last Name</SForm.Label>
                      <Field name="last_name">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                      <Styled.ErrorMessage name="last_name" />
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col>
                    <SForm.Label>Email</SForm.Label>
                    <Field name="email">
                      {({ field }) => (
                        <SForm.Input
                          {...field}
                          type="text"
                          autoComplete="email"
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
                        />
                      )}
                    </Field>
                    <Styled.ErrorMessage name="password" />
                  </Col>
                </Row>
                <Row>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#ef4e79",
                      width: "92%",
                      margin: "auto",
                    }}
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  >
                    {this.props.createAccount ? "Sign up" : "Sign in"}
                  </Button>
                </Row>
              </Styled.FormGroup>
            </form>
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
