import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Loading from "../../components/Loading";
import {
  mandated,
  roles,
  statuses,
} from "../ApplicantViewer/applicantInfoHelpers";
import * as Form from "../sharedStyles/formStyles";
import * as Table from "../sharedStyles/tableStyles";
import { Container, Row, Col } from "reactstrap";
import styled from "styled-components";
import Icon from "../../components/Icon";

const keyToValue = (key) => {
  key = key.replace(/_/g, " ");
  key = key
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return key;
};

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

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
    };
  }
  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
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
  render() {
    const { users, loading } = this.props;
    return (
      <Table.Container style={{width:"100%", "max-width":"none"}}>
        <Table.Table>
          <tbody>
            <tr>
              <th style={{ color: "#960034" }}>Volunteer Name</th>
              <th style={{ color: "#960034" }}>Email Address</th>
              <th style={{ color: "#960034" }}>Phone Number</th>
            </tr>
            {!loading &&
              users.map((user, index) => (
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
                    {user.phone_number.substr(0, 3)}-
                    {user.phone_number.substr(3, 3)}-
                    {user.phone_number.substr(6, 4)}
                  </td>
                  <td>
                    <Styled.Button
                      onClick={() => this.onDisplayEditUserModal(user)}
                    >
                      <Icon color="grey3" name="create" />
                    </Styled.Button>
                  </td>
                </Table.Row>
              ))}
          </tbody>
        </Table.Table>
        {loading && <Loading />}
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
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.last_name
                            : ""
                        }
                        type="text"
                        name="Name"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Form.Input
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
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.zip_code
                            : ""
                        }
                        type="text"
                        name="Zip Code"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Total Hours</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.total_hours
                            : ""
                        }
                        type="text"
                        name="Total Hours"
                      />
                    </Col>
                    <Col>
                      <Form.Label>Court Required</Form.Label>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </Col>
                    <Row>
                      <Col>
                        <Form.Label>Notes</Form.Label>
                        <Form.Input type="textarea"></Form.Input>
                      </Col>
                    </Row>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Address</Form.Label>
                      <Form.Input
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
            <Button color="secondary" onClick={this.onModalClose}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#ef4e79" }}
              onClick={this.onModalClose}
            >
              Update
            </Button>
            {/* <Button color="primary" type="submit">
                Submit
              </Button> */}
          </ModalFooter>
        </Modal>
      </Table.Container>
    );
  }
}

export default UserTable;

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
};
