import { Formik } from "formik";
import { signIn } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";
import BoGButton from "../../../../components/BoGButton";
import InputField from "../../../../components/Forms/InputField";
import { checkInValidator } from "./helpers";
import { checkInVolunteer }  from "../../../../queries/attendances"

class DayOfCheckin extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    let url = new URL(window.location.href);
  };

  handleSubmit = async (values) => {
    if (this.props.createAccount) {
      
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
            phoneNumber: "",
            signature: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.handleSubmit(values);
            setSubmitting(false);
          }}
          validationSchema={
            checkInValidator
          }
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <form className="flex-column flex w-full space-y-2">
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
              <InputField
                name="email"
                label="Email Address"
                placeholder="Your Email"
                type="email"
              />
              <InputField 
                name="phoneNumber"
                label="Phone Number"
                placeholder="Your Phone Number"
                type="phoneNumber"
              />
              <InputField
                name="signature"
                label="Signature"
                placeholder="Enter your initials"
                type="signature"
              />
              <BoGButton
                type="submit"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                text="Check-In"
                className="mb-4 w-full bg-primaryColor hover:bg-hoverColor"
              />
            </form>
          )}
        </Formik>
      </React.Fragment>
    );
  };
}

export default DayOfCheckin;

DayOfCheckin.propTypes = {
  createAccount: PropTypes.bool,
  companyCode: PropTypes.string,
  context: PropTypes.object.isRequired,
};
