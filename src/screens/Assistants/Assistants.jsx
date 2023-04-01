import { Formik } from "formik";
import { useSession } from "next-auth/react";
import Error from "next/error";
import PropTypes from "prop-types";
import React from "react";
import BoGButton from "../../components/BoGButton";
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
import {
  deleteUser,
  getInvitedAdmins,
  getUsers,
  removeInvitedAdmin,
  updateInvitedAdmins,
} from "../../actions/queries";
import * as Form from "../sharedStyles/formStyles";
import AssistantTable from "./AssistantTable";
import { invitedAdminValidator } from "./helpers";
import InputField from "../../components/Forms/InputField";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";

// TODOCD: Implement Search Feature

const PAGE_SIZE = 10;

const Styled = {
  Col: styled(Col)`
    margin-top: 0.5rem;
  `,
  Row: styled(Row)`
    margin: 0.5rem 0.5rem 0.5rem 1rem;
  `,
  Search: styled.input`
    height: 3rem;
    width: 100%;
    font-size: 1.5rem;
    padding-left: 0.5rem;
    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
};

class Assistants extends React.Component {
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
  };

  componentDidMount = () => this.onRefresh();
  onRefresh = () => {
    this.setState({ loadingMoreUsers: true });
    getInvitedAdmins(this.props.user.organizationId).then((result) => {
      if (result && result.data) {
        this.setState({
          invitedAdmins: result.data,
        });
      }
    });
    getUsers().then((result) => {
      if (result && result.data && result.data.users) {
        this.setState({
          users: result.data.users.filter(
            (user) =>
              user.role === "admin" ||
              user.role === "admin-assistant" ||
              user.role === "staff"
          ),
          currentPage: 0,
          loadingMoreUsers: false,
        });
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
    /** code to update users in state at that specific index */
  };

  onDeletePending = (email) => {
    removeInvitedAdmin(email, this.props.user.organizationId).then(() => {
      this.componentDidMount();
    });
  };

  onDeleteUser = (id, user) => {
    deleteUser(id, user).then(() => {
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

  handleSubmit = async (values) => {
    if (values?.email?.length)
      await updateInvitedAdmins(values.email, this.props.user.organizationId);
    this.onModalClose();
    this.onRefresh();
  };

  filteredAndSortedAdmins = (admins) => {
    return (
      this.state.searchValue.length > 0
        ? admins.filter(
            (admin) =>
              admin.last_name
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase()) ||
              admin.email
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase()) ||
              admin.first_name
                ?.toLowerCase()
                .includes(this.state.searchValue.toLowerCase())
          )
        : admins
    ).sort((a, b) =>
      a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0
    );
  };

  render() {
    const { loadingMoreUsers } = this.state;
    return (
      <div className="relative left-[10%] flex h-full w-full flex-col justify-center pt-4">
        <Styled.Row>
          <div className="text-4xl font-bold not-italic text-black">
            Employees
          </div>
        </Styled.Row>
        <Styled.Row>
          <Styled.Col>
            <Styled.Search
              placeholder="Search by Employee Name or Email"
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
            <AssistantTable
              sessionUser={this.props.user}
              users={this.getUsersAtPage()}
              invitedAdmins={this.state.invitedAdmins}
              // invitedAdmins={["test"]}
              loading={loadingMoreUsers}
              editUserCallback={this.onEditUser}
              deletePendingCallback={this.onDeletePending}
              deleteUserCallback={this.onDeleteUser}
            />
          </div>
        </Styled.Row>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.handleSubmit(values);
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
                  onClick={() => this.onModalClose(false)}
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

export default AdminAuthWrapper(Assistants);

Assistants.propTypes = {
  user: PropTypes.object.isRequired,
};
