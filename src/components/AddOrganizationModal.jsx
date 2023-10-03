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
      prompt: "Enter OrgId:",
    };
  }

  handleSubmit = async (values) => {
    if (this.props.data.user) {
      updateUserOrganizationId(this.props.data.user?._id, values.orgCode)
        .then((res) => {
          console.log(res);
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
                className="color-blue"
                onClick={handleSubmit}
                disabled={isSubmitting}
                text="Submit Code"
                type="submit"
              />
            </form>
          )}
        </Formik>
      </React.Fragment>
    );
  }
}

AddOrganizationModal.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AddOrganizationModal;
