import PropTypes from "prop-types";
import { Formik } from "formik";
import React from "react";
import BoGButton from "./BoGButton";
import InputField from "./Forms/InputField";
import "flowbite-react";
import { updateUserOrganizationId } from "../../../queries/users";

class AddOrganizationModal extends React.Component {
  constructor(props) {
    super(props);
    this.error = false;

    this.state = {
      userId: props.userId,
      incorrectOrg: false,
    };
  }

  handleSubmit = async (values) => {
    updateUserOrganizationId(props.userId, values.orgCode)
      .then(() => {
        // redirect the user to the home page
      })
      .catch((error) => {
        if (error.response.status !== 200) {
          this.state.incorrectOrg = True;
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
                <InputField name="orgCode" label="Org Code" />
              </div>
              <BoGButton
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                text="Submit Code"
                className="mb-4 w-full bg-primaryColor hover:bg-hoverColor"
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