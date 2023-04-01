import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import InputField from "./InputField";
import React from "react";
import BoGButton from "../BoGButton";

class EditUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.userSelectedForEdit,
    };
  }
  render() {
    if (this.props.userSelectedForEdit) {
      return (
        <Formik
          enableReinitialize
          initialValues={this.props.userSelectedForEdit}
          onSubmit={this.props.submitHandler}
        >
          <Form>
            <div className="grid grid-cols-6 gap-x-4 gap-y-1">
              <InputField
                className="col-span-6 md:col-span-3"
                name={"first_name"}
                label={"First Name"}
                isRequired={true}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-3"
                name={"last_name"}
                label={"Last Name"}
                isRequired={true}
                disabled={this.props.disableEdit}
                type={"text"}
              />

              <InputField
                className="col-span-6 md:col-span-3"
                name={"email"}
                label={"Email"}
                isRequired={true}
                disabled={true}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-3"
                name={"phone_number"}
                label={"Phone"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-3"
                name={"date_of_birth"}
                label={"Date of Birth"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-3"
                name={"address"}
                label={"Address"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-2"
                name={"city"}
                label={"City"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-2"
                name={"state"}
                label={"State"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              <InputField
                className="col-span-6 md:col-span-2"
                name={"zip_code"}
                label={"Zip Code"}
                isRequired={false}
                disabled={this.props.disableEdit}
                type={"text"}
              />
              {this.props.isAdmin && (
                <InputField
                  className="col-span-6"
                  name={"notes"}
                  label={"Notes"}
                  isRequired={false}
                  disabled={this.props.disableEdit}
                  type={"text"}
                />
              )}
            </div>
            <div className="flex flex-row justify-center gap-2">
              {this.props.isPopUp && (
                <BoGButton
                  onClick={this.props.closePopUp}
                  text="Cancel"
                  outline={true}
                />
              )}
              <BoGButton text="Update" type="submit" />
            </div>
          </Form>
        </Formik>
      );
    } else {
      return null;
    }
  }
}

EditUserForm.propTypes = {
  userSelectedForEdit: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isPopUp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.string.isRequired,
  closePopUp: PropTypes.func,
  disableEdit: PropTypes.bool.isRequired,
};

export default EditUserForm;
