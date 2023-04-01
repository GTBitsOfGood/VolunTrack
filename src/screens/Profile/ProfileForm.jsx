import PropTypes from "prop-types";
import React from "react";
import EditUserForm from "../../components/Forms/EditUserForm";
import { updateUser } from "../../queries/users";

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: true,
      user: props.user,
      visibleText: false,
      placeHolders: {
        email: this.props.user.email,
        first_name: this.props.user.first_name,
        last_name: this.props.user.last_name,
        phone_number: this.props.user.phone_number,
        date_of_birth: this.props.user.date_of_birth,
        zip_code: this.props.user.zip_code,
        address: this.props.user.address,
        city: this.props.user.city,
        state: this.props.user.state,
        notes: this.props.user.notes,
      },
    };
  }

  handleSubmit = async (values) => {
    this.setState({
      visibleText: true,
    });
    let bio = {
      email: this.props.user.email,
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      date_of_birth: values.date_of_birth,
      zip_code: values.zip_code,
      address: values.address,
      city: values.city,
      state: values.state,
      notes: values.notes,
    };
    await updateUser(this.state.user._id, {
      adminId: this.state.user._id,
      bio: bio,
    });

    // todo: this will always run
    this.props.context.startLoading();
    this.props.context.success("Profile successfully updated!");
    this.props.router.reload();
  };

  render() {
    const isAdmin = this.props.isAdmin;

    return (
      <React.Fragment>
        <div className="w-3/4 rounded-md bg-white p-3 md:w-1/2">
          {this.state.user && (
            <div>
              <p className="text-primaryColor text-2xl font-semibold">{`${this.state.user.bio?.first_name} ${this.state.user.bio?.last_name}`}</p>
              <p className="mb-2 capitalize">{this.state.user.role}</p>
              <EditUserForm
                userSelectedForEdit={this.state.placeHolders}
                isAdmin={isAdmin}
                isPopUp={false}
                submitHandler={this.handleSubmit}
                disableEdit={false}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ProfileForm;

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
};
