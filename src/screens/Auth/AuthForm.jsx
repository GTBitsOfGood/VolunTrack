import { Formik } from "formik";
import { signIn } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";
import BoGButton from "../../components/BoGButton";
import InputField from "../../components/Forms/InputField";
import { createUserFromCredentials } from "../../queries/users";
import { applyTheme } from "../../themes/themes";
import { createAccountValidator, loginValidator } from "./helpers";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    let url = new URL(window.location.href);

    this.state = {
      nonprofitCode:
        url.pathname === "/create-account" || url.pathname === "/login"
          ? ""
          : url.pathname.substring(1),
    };

    if (url.searchParams.has("error")) {
      this.props.context.startLoading();
      this.props.context.failed("Your username or password is incorrect.");
    }
    applyTheme("purple"); // This applies a default theme before we know which org
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
            // this.props.context.failed(error.response.data);
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
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            orgCode: this.state.nonprofitCode,
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
            <form className="flex-column flex w-full space-y-2">
              {this.props.createAccount && (
                <div className="flex space-x-4">
                  <InputField
                    name="firstName"
                    placeholder="First Name"
                    label="First Name"
                  />
                  <InputField
                    name="lastName"
                    label="Last Name"
                    placeholder="Last Name"
                  />
                </div>
              )}
              <InputField
                name="email"
                label="Email Address"
                placeholder="Your Email"
                type="email"
              />
              <InputField
                name="password"
                label="Password"
                type="password"
                placeholder="Your Password"
                autoComplete="current-password"
              />
              {this.props.createAccount && (
                <InputField
                  name="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                  placeholder="Your Password"
                />
              )}
              {this.props.createAccount && this.state.nonprofitCode === "" && (
                <InputField
                  name="orgCode"
                  label="Organization Code"
                  placeholder="Your organization's code"
                />
              )}
              <BoGButton
                type="submit"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                text={
                  this.props.createAccount ? "Create an account" : "Sign In"
                }
                className="mb-4 w-full bg-primaryColor hover:bg-hoverColor"
              />
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
  companyCode: PropTypes.string,
  context: PropTypes.object.isRequired,
};
