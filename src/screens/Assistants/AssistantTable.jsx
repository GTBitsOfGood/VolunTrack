import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Loading from "../../components/Loading";
import * as Form from "../sharedStyles/formStyles";
import * as Table from "../sharedStyles/tableStyles";
import { Container, Row, Col } from "reactstrap";
import styled from "styled-components";
import Icon from "../../components/Icon";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { updateRole } from "../../actions/queries";
import Pagination from "../../components/PaginationComp";

// const keyToValue = (key) => {
//   key = key.replace(/_/g, " ");
//   key = key
//     .toLowerCase()
//     .split(" ")
//     .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
//     .join(" ");
//   return key;
// };

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
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
      updateRole(this.state.userSelectedForEdit.email, "admin");
    }
    if (event.value === "Admin Assistant") {
      const newRoleName = "admin-assistant";
      this.props.users
        .filter((user) => user === this.state.userSelectedForEdit)
        .map((selectedUser) => (selectedUser.role = newRoleName));
      updateRole(this.state.userSelectedForEdit.email, "admin-assistant");
    }
    if (event.value === "Staff") {
      updateRole(this.state.userSelectedForEdit.email, "staff");
      const newRoleName = "staff";
      this.props.users
        .filter((user) => user === this.state.userSelectedForEdit)
        .map((selectedUser) => (selectedUser.role = newRoleName));
    }
    return;
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
      <Table.Container style={{ width: "100%", maxWidth: "none" }}>
        <Table.Table>
          <tbody>
            <tr>
              <th style={{ color: "#960034" }}>Name</th>
              <th style={{ color: "#960034" }}>Email Address</th>
              <th style={{ color: "#960034" }}>Role</th>
            </tr>
            {!loading &&
              users
                .slice(
                  this.state.currentPage * this.state.pageSize,
                  (this.state.currentPage + 1) * this.state.pageSize
                )
                .map((user, index) => (
                  <Table.Row key={index} evenIndex={index % 2 === 0}>
                    <td>{user.name}</td>
                    <td>
                      {user.email}
                      <Styled.Button
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                        }}
                      >
                        <Icon color="grey3" name="copy" />
                      </Styled.Button>
                    </td>
                    <td>
                      {user.role == "admin"
                        ? "Administrator"
                        : user.role == "admin-assistant"
                        ? "Admin Assistant"
                        : user.role == "staff"
                        ? "Staff"
                        : user.role.charAt(0).toUpperCase() +
                          user.role.slice(1)}
                    </td>
                    {!invitedAdmins.includes(user.email) ? (
                      <td>
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
                      </td>
                    ) : (
                      <td>
                        Pending
                        <Styled.Button
                          onClick={() =>
                            this.onDisplayDeletePending(user.email)
                          }
                        >
                          <Icon color="grey3" name="delete" />
                        </Styled.Button>
                      </td>
                    )}
                  </Table.Row>
                ))}
          </tbody>
        </Table.Table>
        {loading && <Loading />}
        {/* Edit Modal */}
        <Modal
          style={{ "max-width": "750px" }}
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
              <form>
                <Form.FormGroup>
                  <Row>
                    <Col>
                      <Form.Label>First Name</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.first_name
                            : ""
                        }
                        type="text"
                        name="Name"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.last_name
                            : ""
                        }
                        type="text"
                        name="Name"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Role</Form.Label>
                      <Dropdown
                        options={roles}
                        onChange={(e) => {
                          this.handleStatus(e);
                        }}
                        value={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.role == "admin"
                              ? "Administrator"
                              : this.state.userSelectedForEdit.role ==
                                "admin-assistant"
                              ? "Admin Assistant"
                              : this.state.userSelectedForEdit.role == "staff"
                              ? "Staff"
                              : { defaultOption }
                            : { defaultOption }
                        }
                        placeholder="Select an option"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.email
                            : ""
                        }
                        type="text"
                        name="Email"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Phone</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.phone_number
                            : ""
                        }
                        type="text"
                        name="Phone"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.date_of_birth
                            : ""
                        }
                        type="text"
                        name="Date of Birth"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.zip_code
                            : ""
                        }
                        type="text"
                        name="Zip Code"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Address</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.address
                            : ""
                        }
                        type="text"
                        name="Address"
                      />
                    </Col>
                    <Col>
                      <Form.Label>City</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.city
                            : ""
                        }
                        type="text"
                        name="City"
                      />
                    </Col>
                    <Col>
                      <Form.Label>State</Form.Label>
                      <Form.Input
                        readOnly={true}
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.state
                            : ""
                        }
                        type="text"
                        name="State"
                      />
                    </Col>
                  </Row>
                </Form.FormGroup>
              </form>
            </ModalBody>
          </Container>
          <ModalFooter>
            <Button color="secondary" onClick={this.cancel}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#ef4e79" }}
              onClick={this.onModalClose}
            >
              Update
            </Button>
          </ModalFooter>
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
      </Table.Container>
    );
  }
}

export default AssistantTable;

AssistantTable.propTypes = {
  users: PropTypes.array.isRequired,
  invitedAdmins: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deletePendingCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
};
