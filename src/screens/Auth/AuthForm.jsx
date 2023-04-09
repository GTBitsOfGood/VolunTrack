import { Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import BoGButton from "../../components/BoGButton";
import { createAccountValidator, loginValidator } from "./helpers";
import { signIn } from "next-auth/react";
import { createUserFromCredentials } from "../../actions/queries";
import InputField from "../../components/Forms/InputField";
import { applyTheme } from "../../themes/themes";

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
    } else {
      applyTheme("magenta"); // This applies a default theme before we know which org
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
            org_code: this.state.nonprofitCode,
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
                    name="first_name"
                    placeholder="First Name"
                    label="First Name"
                  />
                  <InputField
                    name="last_name"
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
                  name="password_confirm"
                  label="Confirm Password"
                  type="password"
                  placeholder="Your Password"
                />
              )}
              {this.props.createAccount && this.state.nonprofitCode === "" && (
                <InputField
                  name="org_code"
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
                className="bg-primaryColor hover:bg-hoverColor w-full"
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
