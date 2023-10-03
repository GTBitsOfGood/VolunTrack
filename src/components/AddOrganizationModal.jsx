import PropTypes from "prop-types";
import { Formik } from "formik";
import React from "react";
import BoGButton from "./BoGButton";
import InputField from "./Forms/InputField";
import "flowbite-react";
import { updateUserOrganizationId } from "../queries/users";
import router from "next/router";

class AddOrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    this.state = {
      userId: props.userId,
      prompt: "Enter OrgId:"
    };
  }

  handleSubmit = async (values) => {
    updateUserOrganizationId(this.props.userId, values.orgCode)
      .then(() => {
        router.push("/home");
      })
      .catch((error) => {
        if (error.response.status !== 200) {
          this.state.prompt = "The provided ORG CODE was incorrect. Please try again";
        }
      });
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          initialValues={{
            orgCode: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form className="flex-column flex w-full space-y-2">
              <div className="flex space-x-4">
                <InputField name="orgCode" label={this.state.prompt} />
              </div>
              <BoGButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                text="Submit Code"
              />
            </form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

AddOrganizationModal.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AddOrganizationModal;
