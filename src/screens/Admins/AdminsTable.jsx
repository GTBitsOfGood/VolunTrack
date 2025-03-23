import { Table, Tooltip } from "flowbite-react";
import BoGButton from "../../components/BoGButton";
import PropTypes from "prop-types";
import React from "react";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import {
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { updateUser } from "../../queries/users";
import EditUserForm from "../../components/Forms/EditUserForm";
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

class AdminsTable extends React.Component {
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
    return (
      <div className="m-auto h-full w-full">
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
                    <Table.Cell>
                      {(user.firstName ?? "") + " " + (user.lastName ?? "")}
                    </Table.Cell>
                    <Table.Cell className="flex items-center">
                      <div className="flex items-center">
                        {user.email}
                        <Tooltip content="Copy" style="light">
                          <button
                            className="mx-1"
                            onClick={() => {
                              navigator.clipboard.writeText(user.email);
                            }}
                          >
                            <DocumentDuplicateIcon className="ml-2 h-7 text-primaryColor" />
                          </button>
                        </Tooltip>
                      </div>
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
                        <div className="flex">
                          <Tooltip content="Edit" style="light">
                            <button
                              className="mx-1"
                              onClick={() => this.onDisplayEditUserModal(user)}
                            >
                              <PencilIcon className="h-7 text-primaryColor" />
                            </button>
                          </Tooltip>
                          {this.props.canEdit && (
                            <Tooltip content="Delete" style="light">
                              <button
                                className="mx-1"
                                onClick={() =>
                                  this.onDisplayDeleteUserModal(user)
                                }
                              >
                                <TrashIcon className="h-7 text-primaryColor" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </Table.Cell>
                    ) : (
                      <Table.Cell>
                        <div className="flex">
                          Pending
                          <Tooltip content="Delete" style="light">
                            <button
                              className="mx-1"
                              onClick={() =>
                                this.onDisplayDeletePending(user.email)
                              }
                            >
                              <TrashIcon className="h-7 text-primaryColor" />
                            </button>
                          </Tooltip>
                        </div>
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
                isAdmin={this.props.sessionUser.role === "admin"} // Update to correctly pass permissions
                closePopUp={this.cancel}
                disableEdit={!this.props.canEdit}
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
            <BoGButton
              onClick={this.closePendingModal}
              text="Cancel"
              outline={true}
            />
            <BoGButton onClick={this.handleSubmitForPending} text="Delete" />
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
            <BoGButton
              onClick={this.handleSubmitForDeleteUser}
              text="Cancel"
              outline={true}
            />
            <BoGButton onClick={this.handleSubmitForDeleteUser} text="Delete" />
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
      </div>
    );
  }
}

export default AdminsTable;

AdminsTable.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  invitedAdmins: PropTypes.array,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deletePendingCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
};
