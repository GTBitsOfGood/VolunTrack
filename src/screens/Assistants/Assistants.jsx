import { useSession } from "next-auth/react";
import Error from "next/error";
import React, { useState } from "react";
import { updateInvitedAdmins } from "../../actions/queries";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Container,
} from "reactstrap";
import styled from "styled-components";
// import { invitedAdminsValidator } from "./helpers";
import * as Form from "../sharedStyles/formStyles";
import { fetchUserCount, fetchUserManagementData } from "../../actions/queries";
import EmployeeTable from "./EmployeeTable";
import variables from "../../design-tokens/_variables.module.scss";
import fusers from "quill";

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
    maxWidth: 80rem;
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
  Button: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 11.5rem;
    height: 2.5rem;
    margin-top: 2rem;
    margin-bottom: 2vw;
    margin-left: 2vw;
  `,
  AddAdminButton: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 11.5rem;
    height: 2.5rem;
    margin-top: 0.2rem;
    margin-bottom: 2vw;
    margin-left: auto;
    margin-right: 0;
  `,
  ToBeginningButton: styled(Button)`
    background: white;
    border: none;
    margin-left: auto;
    margin-right: 1rem;
    color: black;
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
  };

  // const [searchValue, setSearchValue] = useState("");

  componentDidMount = () => this.onRefresh();
  onRefresh = () => {
    this.setState({ loadingMoreUsers: true });
    fetchUserCount().then((result) => {
      if (result && result.data && result.data.count) {
        this.setState({
          userCount: result.data.count,
        });
      }
    });
    this.setState({ invitedAdmins: this.getInvitedAdminList() });
    fetchUserManagementData().then((result) => {
      if (result && result.data && result.data.users) {
        this.setState({
          users: result.data.users.filter(
            (user) =>
              user.role == "admin" ||
              user.role == "admin-assistant" ||
              user.role == "staff"
          ),
          currentPage: 0,
          loadingMoreUsers: false,
          invitedAdmins: this.getInvitedAdminList(),
        });
      }
    });
  };
  // onNextPage = () => {
  //   const { currentPage, users } = this.state;
  //   if ((currentPage + 1) * PAGE_SIZE === users.length) {
  //     this.setState({ loadingMoreUsers: true });
  //     fetchUserManagementData(users[users.length - 1]._id).then((result) => {
  //       if (result && result.data && result.data.users) {
  //         this.setState({
  //           users: [...users, ...result.data.users].filter(
  //             (user) =>
  //               user.role == "admin" ||
  //               user.role == "admin-assistant" ||
  //               user.role == "staff"
  //           ),
  //           currentPage: currentPage + 1,
  //           loadingMoreUsers: false,
  //         });
  //       }
  //     });
  //   } else {
  //     this.setState({
  //       currentPage: currentPage + 1,
  //     });
  //   }
  // };
  // onPreviousPage = () =>
  //   this.setState({ currentPage: this.state.currentPage - 1 });
  // onToBeginning = () => this.setState({ currentPage: 0 });
  getUsersAtPage = () => {
    const { users, currentPage } = this.state;
    const start = currentPage * PAGE_SIZE;
    return this.filteredAndSortedAdmins(users.slice(start, start + PAGE_SIZE));
  };
  getInvitedAdminList = () => {
    const { invitedAdmins, currentPage } = this.state;
    const start = currentPage * PAGE_SIZE;
    return this.filteredAndSortedAdmins(
      invitedAdmins.slice(start, start + PAGE_SIZE)
    );
  };
  atEnd = () =>
    (this.state.currentPage + 1) * PAGE_SIZE >= this.state.userCount;
  onEditUser = () => {
    /** code to update users in state at that specific index */
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
  };

  handleSubmit = async (e) => {
    console.log(this.state.newInvitedAdmin);
    await updateInvitedAdmins(this.state.newInvitedAdmin);
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
    const { currentPage, loadingMoreUsers } = this.state;
    return (
      <Styled.Container>
        <Styled.Row>
          <Styled.Text>Employees</Styled.Text>
        </Styled.Row>
        <Styled.Row>
          <Styled.Col>
            <Styled.Search
              placeholder="Search by Volunteer Name or Email"
              value={this.state.searchValue}
              onChange={(e) => this.setState({ searchValue: e.target.value })}
            />
          </Styled.Col>
          <Styled.Col>
            <Styled.AddAdminButton onClick={this.onCreateClicked}>
              <span style={{ color: "white" }}>Add an Admin</span>
            </Styled.AddAdminButton>
          </Styled.Col>
        </Styled.Row>
        <Styled.Row>
          <Styled.TableUsers>
            <EmployeeTable
              users={this.getUsersAtPage()}
              invitedAdmins={this.getInvitedAdminList()}
              // invitedAdmins={["test"]}
              loading={loadingMoreUsers}
              editUserCallback={this.onEditUser}
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
              <form>
                <Form.FormGroup>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Form.Input
                        type="text"
                        name="email"
                        onChange={(evt) =>
                          this.setState({ newInvitedAdmin: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                </Form.FormGroup>
              </form>
            </ModalBody>
          </Container>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.onModalClose(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#ef4e79" }}
              onClick={() => this.onModalClose(true)}
            >
              Add as an Admin
            </Button>
          </ModalFooter>
        </Modal>
      </Styled.Container>
    );
  }
}

export default authWrapper(Assistants);
