import PropTypes from "prop-types";
import { Formik } from "formik";
import React from "react";
import BoGButton from "./BoGButton";
import InputField from "./Forms/InputField";
import "flowbite-react";
import { updateUserOrganizationId } from "../queries/users";
import router from "next/router";
import { signOut } from "next-auth/react";

class AddOrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    this.state = {
      prompt: "",
    };
  }

  handleSubmit = async (values) => {
    if (this.props.data.user) {
      updateUserOrganizationId(this.props.data.user?._id, values.orgCode)
        .then((res) => {
          if (res.status === 200) {
            router.reload();
          }
        })
        .catch(() => {
          this.setState({
            prompt: "The provided ORG CODE was incorrect. Please try again",
          });
        });
    }
  };

  render() {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="flex h-screen w-1/4 flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-semibold">Enter Org Code</h2>
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
                    <InputField
                      name="orgCode"
                      label={this.state.prompt}
                      className="w-full"
                    />
                  </div>
                  <BoGButton
                    className="color-blue"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    text="Submit Code"
                    type="submit"
                  />
                  <button className="mt-8 hover:underline" onClick={signOut}>
                    Wrong account? Log out
                  </button>
                </form>
              )}
            </Formik>
          </React.Fragment>
        </div>
      </div>
    );
  }
}

AddOrganizationModal.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AddOrganizationModal;
