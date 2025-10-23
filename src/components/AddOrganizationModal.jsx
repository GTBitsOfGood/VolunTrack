import PropTypes from "prop-types";
import { Formik } from "formik";
import React from "react";
import BoGButton from "./BoGButton";
import InputField from "./Forms/InputField";
import { Toast } from "flowbite-react";
import { updateUserOrganizationId } from "../queries/users";
import router from "next/router";
import { signOut } from "next-auth/react";
import { XCircleIcon } from "@heroicons/react/24/solid";

class AddOrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    this.state = {
      errorMessage: "",
      showError: false,
    };
  }

  handleSubmit = async (values) => {
    if (this.props.data.user) {
      // Clear any previous error before making the request
      this.setState({
        errorMessage: "",
        showError: false,
      });

      const res = await updateUserOrganizationId(
        this.props.data.user?._id,
        values.orgCode
      );

      if (res.status === 200) {
        router.reload();
      } else {
        // Show error toast with the message from the API
        const errorMessage =
          res.data?.message ||
          res.data?.error ||
          res.error ||
          "The provided organization code is invalid. Please try again.";

        this.setState({
          errorMessage: errorMessage,
          showError: true,
        });
      }
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
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await this.handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form className="flex-column flex w-full space-y-2">
                  <div className="flex space-x-4">
                    <InputField
                      name="orgCode"
                      label="Organization Code"
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
        {this.state.showError && (
          <div className="fixed bottom-4 right-4">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <XCircleIcon className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                {this.state.errorMessage}
              </div>
              <Toast.Toggle
                onDismiss={() => this.setState({ showError: false })}
              />
            </Toast>
          </div>
        )}
      </div>
    );
  }
}

AddOrganizationModal.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AddOrganizationModal;
