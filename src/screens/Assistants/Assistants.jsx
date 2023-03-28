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

// TODOCD: Implement Search Feature

const PAGE_SIZE = 10;

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 10%;
  `,
  PaginationContainer: styled.div`
    background: white;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    height: 3rem;

    p {
      color: ${(props) => props.theme.grey5};
      margin: 0 1rem;
      font-size: 1.2rem;
    }
  `,
  ButtonContainer: styled.div`
    width: 95%;
    maxwidth: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
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
  TableUsers: styled.div`
    width: 80%;
  `,
  Text: styled.div`
    color: #000000;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 41px;
  `,
};

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

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

  onModalClose = (isUpdating) => {
    this.setState({
      showNewAdminModal: false,
    });
    if (isUpdating) {
      this.handleSubmit();
    }
    this.setState({
      newInvitedAdmin: "",
    });
  };

  handleSubmit = async () => {
    if (this.state.newInvitedAdmin?.length > 0)
      await updateInvitedAdmins(
        this.state.newInvitedAdmin,
        this.props.user.organizationId
      );
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
      <Styled.Container>
        <Styled.Row>
          <Styled.Text>Employees</Styled.Text>
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
          <Styled.TableUsers>
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
          </Styled.TableUsers>
        </Styled.Row>

        <Modal
          style={{ "max-width": "750px" }}
          isOpen={this.state.showNewAdminModal}
          onClose={null}
        >
          <ModalHeader color="#ef4e79">{"Add Admin"}</ModalHeader>
          <Container>
            <ModalBody>
              <Formik validationSchema={invitedAdminValidator}>
                <Form.FormGroup>
                  <Row>
                    <Col>
                      <InputField
                        label="Email"
                        type="text"
                        name="email"
                        autocomplete="off"
                        onChange={(evt) => {
                          this.setState({ newInvitedAdmin: evt.target.value });
                          invitedAdminValidator
                            .isValid({ email: this.state.newInvitedAdmin })
                            .then((valid) => {
                              this.setState({
                                valid: valid,
                              });
                            });
                        }}
                      />
                    </Col>
                  </Row>
                </Form.FormGroup>
              </Formik>
            </ModalBody>
          </Container>
          <ModalFooter>
            <BoGButton
              text="Cancel"
              outline={true}
              onClick={() => this.onModalClose(false)}
            />
            <BoGButton
              text="Add as an Admin"
              onClick={() => this.onModalClose(true)}
              disabled={!this.state.valid}
            />
          </ModalFooter>
        </Modal>
      </Styled.Container>
    );
  }
}

export default authWrapper(Assistants);

Assistants.propTypes = {
  user: PropTypes.object.isRequired,
};
