import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { Button, Container } from "reactstrap";
import * as Table from "../sharedStyles/tableStyles";
import styled from "styled-components";
import { updateUser } from "../../actions/queries";
import { capitalizeFirstLetter } from "../../screens/Profile/helpers";
import EditUserForm from "../../components/Forms/EditUserForm";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.ul`
    list-style-type: none;
  `,
  List: styled.li`
    padding-bottom: 120px;
  `,
  HeaderContainer: styled.div`
    margin-bottom: 2rem;
  `,
};
class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: true,
      user: props.user,
      visibleText: false,
      placeHolders: {
        email: this.props.user.bio.email,
        first_name: this.props.user.bio.first_name,
        last_name: this.props.user.bio.last_name,
        phone_number: this.props.user.bio.phone_number,
        date_of_birth: this.props.user.bio.date_of_birth,
        zip_code: this.props.user.bio.zip_code,
        address: this.props.user.bio.address,
        city: this.props.user.bio.city,
        state: this.props.user.bio.state,
        notes: this.props.user.bio.notes,
      },
    };
  }

  handleSubmit = async (values) => {
    this.setState({
      visibleText: true,
    });
    let bio = {
      email: this.props.user.bio.email,
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
        <Table.Container
          style={{ width: "50%", maxWidth: "none", padding: "3rem" }}
        >
          {this.state.user && (
            <Container>
              <Styled.HeaderContainer>
                <p
                  style={{
                    margin: "0px",
                    color: "#7F1C3B",
                    width: "240px",
                    fontSize: "24px",
                    fontWeight: "800",
                  }}
                >{`${this.state.user.bio?.first_name} ${this.state.user.bio?.last_name}`}</p>
                <p style={{ margin: "0px" }}>{`${capitalizeFirstLetter(
                  this.state.user.role ?? ""
                )}`}</p>
              </Styled.HeaderContainer>
              <EditUserForm
                userSelectedForEdit={this.state.placeHolders}
                isAdmin={isAdmin}
                isPopUp={false}
                submitHandler={this.handleSubmit}
              />
            </Container>
          )}
        </Table.Container>
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
