import { Table, Tooltip } from "flowbite-react";
import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import EditUserForm from "../../components/Forms/EditUserForm";
import {
  PencilIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import router from "next/router";
import DeleteUserForm from "../../components/Forms/DeleteUserForm";
import BoGButton from "../../components/BoGButton";

class MemberTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
      editModalOpen: false,
      currentPage: 0,
      pageSize: 10,
      userSelectedForDeletion: null,
      deleteModalOpen: false,
      deleteResultModalOpen: false,
      deleteResultStatus: null,
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
      editModalOpen: true,
    });
  };

  onDisplayDeleteUserModal = (userToDelete) => {
    this.setState({
      userSelectedForDeletion: userToDelete,
      deleteModalOpen: true,
    });
  };
  deleteUser = (id) => {
    // deleteUser(id);
    this.props.deleteUserCallback(id);
  };

  statsOnClick = (user) => {
    router.push(`stats/${user._id}`);
  };

  onEditModalClose = () => {
    this.setState({
      userSelectedForEdit: null,
      editModalOpen: false,
    });
  };
  onDeleteModalClose = () => {
    this.setState({
      userSelectedForDeletion: null,
      deleteModalOpen: false,
    });
  };
  onDeleteResultModalClose = () => {
    this.setState({
      deleteResultModalOpen: false,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  handleEditSubmit = (values) => {
    this.props.editUserCallback(this.state.userSelectedForEdit?._id, values);
    this.onEditModalClose();
  };
  handleDeleteSubmit = async () => {
    const deleteSuccess = await this.props.deleteUserCallback(
      this.state.userSelectedForDeletion?._id
    );
    this.onDeleteModalClose();
    if (deleteSuccess) {
      this.setState({
        deleteResultModalOpen: true,
        deleteResultStatus: "success",
      });
    } else {
      this.setState({
        deleteResultModalOpen: true,
        deleteResultStatus: "error",
      });
    }
  };

  render() {
    const { users, loading } = this.props;
    return (
      <div>
        <Table striped={true}>
          <Table.Head className="dark:border-red-700">
            <Table.HeadCell className="text-primaryColor">
              Member Name
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor">
              Email Address
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor">
              Phone Number
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor"> </Table.HeadCell>
          </Table.Head>
          {users
            .slice(
              this.state.currentPage * this.state.pageSize,
              (this.state.currentPage + 1) * this.state.pageSize
            )
            .map((user, index) => (
              <Table.Row key={index} evenIndex={index % 2 === 0}>
                <Table.Cell>
                  {user.firstName} {user.lastName}
                </Table.Cell>
                <Table.Cell>
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
                  {user.phone
                    ? user.phone.substr(0, 3) +
                      "-" +
                      user.phone.substr(3, 3) +
                      "-" +
                      user.phone.substr(6, 4)
                    : ""}
                </Table.Cell>
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
                    <Tooltip content="Delete" style="light">
                      <button
                        className="mx-1"
                        onClick={() => this.onDisplayDeleteUserModal(user)}
                      >
                        <TrashIcon className="h-7 text-primaryColor" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Stats" style="light">
                      <button
                        className="mx-1"
                        onClick={() => this.statsOnClick(user)}
                      >
                        <ChartBarIcon className="h-7 text-primaryColor" />
                      </button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          {loading && <Loading />}
          <Modal
            style={{ maxWidth: "750px" }}
            isOpen={this.state.editModalOpen}
          >
            <ModalHeader color="#ef4e79">
              {this.state.userSelectedForEdit?.name ?? ""}
            </ModalHeader>
            <div className="p-3">
              <EditUserForm
                userSelectedForEdit={this.state.userSelectedForEdit}
                submitHandler={this.handleEditSubmit}
                isPopUp={true}
                isAdmin={this.props.isAdmin}
                closePopUp={this.onEditModalClose}
                disableEdit={false}
              />
            </div>
          </Modal>
          <Modal
            style={{ maxWidth: "750px" }}
            isOpen={this.state.deleteModalOpen}
          >
            <ModalHeader color="#ef4e79">Delete User?</ModalHeader>
            <div className="p-3">
              <DeleteUserForm
                userSelectedForDeletion={this.state.userSelectedForDeletion}
                submitHandler={this.handleDeleteSubmit}
                isPopUp={true}
                isAdmin={this.props.isAdmin}
                closePopUp={this.onDeleteModalClose}
                disableEdit={false}
              />
            </div>
          </Modal>
          <Modal
            style={{ maxWidth: "750px" }}
            isOpen={this.state.deleteResultModalOpen}
          >
            <ModalHeader color="#ef4e79">
              {this.state.deleteResultStatus === "error"
                ? "Something went wrong"
                : "Success"}
            </ModalHeader>
            <div className="flex flex-col gap-4 p-3">
              <div>
                {this.state.deleteResultStatus === "error"
                  ? "Failed to delete user."
                  : "User deleted successfully!"}
              </div>
              <div className="flex">
                <BoGButton
                  text="Confirm"
                  type="submit"
                  onClick={this.onDeleteResultModalClose}
                />
              </div>
            </div>
          </Modal>
        </Table>
        <Pagination
          items={users}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
          updatePageCallback={this.updatePage}
        />
      </div>
    );
  }
}

export default MemberTable;

MemberTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
