import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import BoGButton from "../BoGButton";
import InputField from "./InputField";

class DeleteUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.userSelectedForDeletion,
    };
  }
  render() {
    if (this.props.userSelectedForDeletion) {
      return (
        <Formik
          enableReinitialize
          initialValues={this.props.userSelectedForDeletion}
          onSubmit={this.props.submitHandler}
        >
          <Form>
            <div className="mb-10 mt-4">
              Please confirm if you want to do this. This cannot be undone.
            </div>
            <div className="flex flex-row justify-center gap-2">
              {this.props.isPopUp && (
                <BoGButton
                  onClick={this.props.closePopUp}
                  text="Cancel"
                  outline={true}
                />
              )}
              <BoGButton
                className="bg-red-600 hover:bg-red-800"
                text="Delete"
                type="submit"
                disabled={!this.props.isAdmin}
              />
            </div>
          </Form>
        </Formik>
      );
    } else {
      return null;
    }
  }
}

DeleteUserForm.propTypes = {
  userSelectedForDeletion: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isPopUp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  closePopUp: PropTypes.func,
  disableEdit: PropTypes.bool.isRequired,
};

export default DeleteUserForm;
