import { ErrorMessage, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { Col, FormGroup as BFormGroup, Row } from "reactstrap";
import BoGButton from "../../components/BoGButton";
import styled from "styled-components";
import { createAccountValidator, loginValidator } from "./helpers";
import { signIn } from "next-auth/react";
import { createUserFromCredentials } from "../../actions/queries";
import InputField from "../../components/Forms/InputField";

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

    this.state = {
      companyCode:
        url.pathname === "/create-account" ? "" : url.pathname.substring(1),
    };

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
            company_code: this.state.companyCode,
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
                          placeholder="First Name"
                          label="First Name"
                        />
                      </Col>
                      <Col>
                        <InputField
                          name="last_name"
                          label="Last Name"
                          placeholder="Last Name"
                        />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col>
                      <InputField
                        name="email"
                        label="Email Address"
                        placeholder="Your Email"
                        type="email"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Your Password"
                        autoComplete="current-password"
                      />
                    </Col>
                  </Row>
                  {this.props.createAccount && (
                    <Row>
                      <Col>
                        <InputField
                          name="password_confirm"
                          label="Confirm Password"
                          type="password"
                          placeholder="Your Password"
                        />
                      </Col>
                    </Row>
                  )}
                  {this.props.createAccount && (
                    <Row>
                      <Col>
                        <SForm.Label>Company Code</SForm.Label>
                        <Field name="company_code">
                          {({ field }) => (
                            <SForm.Input
                              {...field}
                              type="company_code"
                              placeholder="Your Company's Code"
                            />
                          )}
                        </Field>
                        <Styled.ErrorMessage name="company_code" />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col>
                      <BoGButton
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        text={
                          this.props.createAccount
                            ? "Create an account"
                            : "Sign In"
                        }
                        className="w-full bg-primaryColor hover:bg-hoverColor"
                      />
                    </Col>
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
  companyCode: PropTypes.string,
  context: PropTypes.object.isRequired,
};
