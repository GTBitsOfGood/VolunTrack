import { Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import {
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../components/BoGButton";
import InputField from "../../components/Forms/InputField";
import SearchBar from "../../components/SearchBar";
import {
  addInvitedAdmin,
  deleteInvitedAdmin,
  getInvitedAdmins,
} from "../../queries/organizations";
import { deleteUser, getUsers } from "../../queries/users";
import { getOrgAdmin } from "../../queries/organizations";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import * as Form from "../sharedStyles/formStyles";
import AdminsTable from "./AdminsTable";
import { invitedAdminValidator } from "./helpers";

const PAGE_SIZE = 10;

const Styled = {
  Col: styled(Col)`
    margin-top: 0.5rem;
  `,
  Row: styled(Row)`
    margin: 0.5rem 0.5rem 0.5rem 1rem;
  `,
};

class Admins extends React.Component {
  state = {
    newInvitedAdmin: "",
    users: [],
    invitedAdmins: [],
    userCount: 0,
    currentPage: 0,
    loadingMoreUsers: false,
    showNewAdminModal: false,
    searchValue: "",
    valid: false,
    isOrgAdmin: false,
  };

  componentDidMount = () => this.onRefresh();
  onRefresh = () => {
    this.setState({ loadingMoreUsers: true });
    getInvitedAdmins(this.props.user.organizationId).then((result) => {
      if (result && result.data) {
        this.setState({
          invitedAdmins: result.data.invitedAdmins,
        });
      }
    });
    getUsers(this.props.user.organizationId, "admin").then((result) => {
      if (result && result.data && result.data.users) {
        this.setState({
          users: result.data.users,
          currentPage: 0,
          loadingMoreUsers: false,
        });
      }
    });

    getOrgAdmin(this.props.user.organizationId).then((result) => {
      if (result && result.data) {
        if (result.data.originalAdminEmail === this.props.user.email) {
          this.setState({
            isOrgAdmin: true,
          });
        }
      }
    });
  };

  getUsersAtPage = () => {
    const { users, currentPage, invitedAdmins } = this.state;
    const modifiedInvitedAdmins = invitedAdmins.map((admin) => ({
      email: admin,
      role: "admin-assistant",
    }));
    const allUsers = users.concat(modifiedInvitedAdmins);
    return this.filteredAndSortedAdmins(allUsers);
  };

  onEditUser = () => {
    /** TODO: Code to update users in state at that specific index */
  };

  onDeletePending = (email) => {
    deleteInvitedAdmin(this.props.user.organizationId, email).then(() => {
      this.componentDidMount();
    });
  };

  onDeleteUser = (id, user) => {
    deleteUser(id).then(() => {
      this.componentDidMount();
    });
  };

  onCreateClicked = () => {
    this.setState({
      showNewAdminModal: true,
    });
  };

  onModalClose = () => {
    this.setState({
      showNewAdminModal: false,
    });
    this.setState({
      newInvitedAdmin: "",
    });
  };

  handleSubmit = async (email) => {
    await addInvitedAdmin(this.props.user.organizationId, email);
    this.onModalClose();
    this.onRefresh();
  };

  filteredAndSortedAdmins = (admins) => {
    return (
      this.state.searchValue.length > 0
        ? admins.filter(
            (admin) =>
              admin.lastName
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase()) ||
              admin.email
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase()) ||
              admin.firstName
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase())
          )
        : admins
    ).sort((a, b) =>
      a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0
    );
  };

  render() {
    const { loadingMoreUsers } = this.state;
    return (
      <div className="relative left-[10%] flex h-full w-full flex-col justify-center pt-4">
        <Styled.Row>
          <div className="text-4xl font-bold not-italic text-black">Admins</div>
        </Styled.Row>
        <Styled.Row>
          <Styled.Col>
            <SearchBar
              placeholder="Search by Admin Name or Email"
              value={this.state.searchValue}
              onChange={(e) => this.setState({ searchValue: e.target.value })}
            />
          </Styled.Col>
          <Styled.Col>
            <BoGButton text="Add an Admin" onClick={this.onCreateClicked} />
          </Styled.Col>
        </Styled.Row>
        <Styled.Row>
          <div className="w-[80%]">
            <AdminsTable
              sessionUser={this.props.user}
              users={this.getUsersAtPage()}
              invitedAdmins={this.state.invitedAdmins}
              // invitedAdmins={["test"]}
              loading={loadingMoreUsers}
              editUserCallback={this.onEditUser}
              deletePendingCallback={this.onDeletePending}
              deleteUserCallback={this.onDeleteUser}
              canEdit={this.state.isOrgAdmin}
            />
          </div>
        </Styled.Row>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.handleSubmit(values.email);
            setSubmitting(false);
          }}
          validationSchema={invitedAdminValidator}
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <Modal
              style={{ "max-width": "750px" }}
              isOpen={this.state.showNewAdminModal}
              onClose={null}
            >
              <ModalHeader color="#ef4e79">{"Add Admin"}</ModalHeader>
              <Container>
                <ModalBody>
                  <Form.FormGroup>
                    <Row>
                      <Col>
                        <InputField
                          label="Email"
                          type="text"
                          name="email"
                          autocomplete="off"
                        />
                      </Col>
                    </Row>
                  </Form.FormGroup>
                </ModalBody>
              </Container>
              <ModalFooter>
                <BoGButton
                  text="Cancel"
                  outline={true}
                  onClick={this.onModalClose}
                />
                <BoGButton
                  type="submit"
                  text="Add as an Admin"
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                />
              </ModalFooter>
            </Modal>
          )}
        </Formik>
      </div>
    );
  }
}

export default AdminAuthWrapper(Admins);

Admins.propTypes = {
  user: PropTypes.object.isRequired,
};
