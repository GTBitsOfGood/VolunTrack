import { Table } from "flowbite-react";
import PropTypes from "prop-types";
import React from "react";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import Icon from "../../components/Icon";
import "react-dropdown/style.css";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import styled from "styled-components";
import { updateUser } from "../../actions/queries";
import EditUserForm from "../../components/Forms/EditUserForm";

const Styled = {
  Button: styled(Button)`
    background: none;
    border: none;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
};

class AssistantTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
      userSelectedForDelete: null,
      pendingSelectedForDelete: null,
      pageSize: 10,
      currentPage: 0,
    };
  }

  onDisplayDeletePending = (pending) => {
    this.setState({
      pendingSelectedForDelete: pending,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  closePendingModal = () => {
    this.setState({
      pendingSelectedForDelete: null,
    });
  };

  onDisplayDeleteUserModal = (userToDelete) => {
    this.setState({
      userSelectedForDelete: userToDelete,
    });
  };

  closeDeleteUserModal = () => {
    this.setState({
      userSelectedForDelete: null,
    });
  };

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
    });
  };

  handleStatus = (event) => {
    if (event.value === "Administrator") {
      const newRoleName = "admin";
      this.props.users
        .filter((user) => user === this.state.userSelectedForEdit)
        .map((selectedUser) => (selectedUser.role = newRoleName));
      updateUser(this.state.userSelectedForEdit._id, {
        adminId: this.props.sessionUser._id,
        role: "admin",
      });
    }
    if (event.value === "Admin Assistant") {
      const newRoleName = "admin-assistant";
      this.props.users
        .filter((user) => user === this.state.userSelectedForEdit)
        .map((selectedUser) => (selectedUser.role = newRoleName));
      updateUser(this.state.userSelectedForEdit._id, {
        adminId: this.props.sessionUser._id,
        role: "admin-assistant",
      });
    }
    if (event.value === "Staff") {
      updateUser(this.state.userSelectedForEdit._id, {
        adminId: this.props.sessionUser._id,
        role: "staff",
      });
      const newRoleName = "staff";
      this.props.users
        .filter((user) => user === this.state.userSelectedForEdit)
        .map((selectedUser) => (selectedUser.role = newRoleName));
    }
  };

  cancel = () => {
    this.props.editUserCallback(this.props.editUserCallback(null));
    this.setState({
      userSelectedForEdit: null,
    });
  };

  onModalClose = (updatedUser) => {
    if (updatedUser) {
      this.props.editUserCallback(updatedUser);
    }
    this.setState({
      userSelectedForEdit: null,
    });
  };

  handleSubmitForPending = () => {
    this.props.deletePendingCallback(this.state.pendingSelectedForDelete);
    this.closePendingModal();
  };

  handleSubmitForDeleteUser = () => {
    this.props.deleteUserCallback(
      this.state.userSelectedForDelete._id,
      this.state.userSelectedForDelete
    );
    this.closeDeleteUserModal();
  };

  render() {
    const { users, invitedAdmins, loading } = this.props;
    const roles = ["Administrator", "Admin Assistant", "Staff"];
    const defaultOption = roles[0];
    return (
      <Styled.Container>
        <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email Address</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell> </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {!loading &&
              users
                .slice(
                  this.state.currentPage * this.state.pageSize,
                  (this.state.currentPage + 1) * this.state.pageSize
                )
                .map((user, index) => (
                  <Table.Row key={index} evenIndex={index % 2 === 0}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>
                      {user.email}
                      <Styled.Button
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                        }}
                      >
                        <Icon color="grey3" name="copy" />
                      </Styled.Button>
                    </Table.Cell>
                    <Table.Cell>
                      {user.role === "admin"
                        ? "Administrator"
                        : user.role === "admin-assistant"
                        ? "Admin Assistant"
                        : user.role === "staff"
                        ? "Staff"
                        : user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                    </Table.Cell>
                    {!invitedAdmins.includes(user.email) ? (
                      <Table.Cell>
                        <Styled.Button
                          onClick={() => this.onDisplayEditUserModal(user)}
                        >
                          <Icon color="grey3" name="create" />
                        </Styled.Button>
                        <Styled.Button
                          onClick={() => this.onDisplayDeleteUserModal(user)}
                        >
                          <Icon color="grey3" name="delete" />
                        </Styled.Button>
                      </Table.Cell>
                    ) : (
                      <Table.Cell>
                        Pending
                        <Styled.Button
                          onClick={() =>
                            this.onDisplayDeletePending(user.email)
                          }
                        >
                          <Icon color="grey3" name="delete" />
                        </Styled.Button>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
          </Table.Body>
        </Table>
        {loading && <Loading />}
        {/* Edit Modal */}
        <Modal
          style={{ maxWidth: "750px" }}
          isOpen={this.state.userSelectedForEdit}
          onClose={null}
        >
          <ModalHeader color="#ef4e79">
            {this.state.userSelectedForEdit
              ? this.state.userSelectedForEdit.name
              : ""}
          </ModalHeader>
          <Container>
            <ModalBody>
              <EditUserForm
                userSelectedForEdit={this.state.userSelectedForEdit}
                submitHandler={this.onModalClose}
                isPopUp={true}
                isAdmin={true} // Update to correctly pass permissions
                closePopUp={this.cancel}
              />
            </ModalBody>
          </Container>
        </Modal>
        {/* Delete Invited Admin Modal */}
        <Modal
          isOpen={this.state.pendingSelectedForDelete}
          onClose={null}
          backdrop="static"
        >
          <ModalHeader>Delete Pending Admin Invitation</ModalHeader>
          <ModalBody>
            Are you sure you want to <b>delete</b> the invitation for this
            pending admin: {this.state.pendingSelectedForDelete}?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closePendingModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleSubmitForPending}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        {/* Delete Current Admin Modal */}
        <Modal
          isOpen={this.state.userSelectedForDelete}
          onClose={null}
          backdrop="static"
        >
          <ModalHeader>Delete Admin</ModalHeader>
          <ModalBody>
            Are you sure you want to <b>permanently</b> delete this admin:{" "}
            {this.state.userSelectedForDelete?.name}?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeDeleteUserModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleSubmitForDeleteUser}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        {users.length !== 0 && (
          <Pagination
            items={users}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            updatePageCallback={this.updatePage}
          />
        )}
      </Styled.Container>
    );
  }
}

export default AssistantTable;

AssistantTable.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  invitedAdmins: PropTypes.array,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deletePendingCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
};
