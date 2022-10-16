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
import Pagination from "../../components/PaginationComp";
import { updateUser } from "../../actions/queries";

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
      first_name: "",
      last_name: "",
      phone_number: 0,
      date_of_birth: 0,
      zip_code: 0,
      total_hours: 0,
      address: "",
      city: "",
      state: "",
      court_hours: "",
      notes: "",
      currentPage: 0,
      pageSize: 10,
      pageCount: 1,
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
    });
  };

  onModalClose = () => {
    this.setState({
      userSelectedForEdit: null,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  getPageCount = () => {
    this.setState({
      pageCount: Math.ceil(this.props.users.length / this.pageSize),
    });
  };

  componentDidMount = () => {
    console.log("componentDidMount");
    console.log(this.props.users.length);
    this.setState({
      pageCount: this.getPageCount(),
    });
    console.log(this.state.pageCount);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(
      this.state.userSelectedForEdit.email,
      this.state.userSelectedForEdit && this.state.first_name
        ? this.state.first_name
        : this.state.userSelectedForEdit.first_name,
      this.state.userSelectedForEdit && this.state.last_name
        ? this.state.last_name
        : this.state.userSelectedForEdit.last_name,
      this.state.userSelectedForEdit && this.state.phone_number
        ? this.state.phone_number
        : this.state.userSelectedForEdit.phone_number,
      this.state.userSelectedForEdit && this.state.date_of_birth
        ? this.state.date_of_birth
        : this.state.userSelectedForEdit.date_of_birth,
      this.state.userSelectedForEdit && this.state.zip_code
        ? this.state.zip_code
        : this.state.userSelectedForEdit.zip_code,
      this.state.userSelectedForEdit && this.state.total_hours
        ? this.state.total_hours
        : this.state.userSelectedForEdit.total_hours,
      this.state.userSelectedForEdit && this.state.address
        ? this.state.address
        : this.state.userSelectedForEdit.address,
      this.state.userSelectedForEdit && this.state.city
        ? this.state.city
        : this.state.userSelectedForEdit.city,
      this.state.userSelectedForEdit && this.state.state
        ? this.state.state
        : this.state.userSelectedForEdit.state,
      this.state.userSelectedForEdit && this.state.court_hours
        ? this.state.court_hours
        : this.state.userSelectedForEdit.court_hours,
      this.state.userSelectedForEdit && this.state.notes
        ? this.state.notes
        : this.state.userSelectedForEdit.notes
    );
    // console.log(this.state.first_name);
    // console.log(this.state.userSelectedForEdit.first_name);
    this.onModalClose();
  };

  render() {
    const { users, loading } = this.props;
    // console.log(users);
    return (
      <Table.Container style={{ width: "100%", "max-width": "none" }}>
        <Table.Table>
          <tbody>
            <tr>
              <th style={{ color: "#960034" }}>Volunteer Name</th>
              <th style={{ color: "#960034" }}>Email Address</th>
              <th style={{ color: "#960034" }}>Phone Number</th>
            </tr>
            {users
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
                    {user.phone_number
                      ? user.phone_number.substr(0, 3) +
                        "-" +
                        user.phone_number.substr(3, 3) +
                        "-" +
                        user.phone_number.substr(6, 4)
                      : ""}
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
                        onChange={(evt) =>
                          this.setState({ first_name: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ last_name: evt.target.value })
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Form.Input
                        disabled="disabled"
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
                        onChange={(evt) =>
                          this.setState({ phone_number: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ date_of_birth: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ zip_code: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ total_hours: evt.target.value })
                        }
                      />
                    </Col>
                    <Col>
                      <Form.Label>Court Required Hours</Form.Label>
                      <Form.Input
                        defaultValue={
                          this.state.userSelectedForEdit
                            ? this.state.userSelectedForEdit.courtH
                            : ""
                        }
                        type="text"
                        name="Court Hours"
                        onChange={(evt) =>
                          this.setState({ court_hours: evt.target.value })
                        }
                      />
                    </Col>
                    <Row>
                      <Col>
                        <Form.Label>Notes</Form.Label>
                        <Form.Input
                          defaultValue={
                            this.state.userSelectedForEdit
                              ? this.state.userSelectedForEdit.notes
                              : ""
                          }
                          type="textarea"
                          onChange={(evt) =>
                            this.setState({ notes: evt.target.value })
                          }
                        ></Form.Input>
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
                        onChange={(evt) =>
                          this.setState({ address: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ city: evt.target.value })
                        }
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
                        onChange={(evt) =>
                          this.setState({ state: evt.target.value })
                        }
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
              onClick={this.handleSubmit}
            >
              Update
            </Button>
            {/* <Button color="primary" type="submit">
                Submit
              </Button> */}
          </ModalFooter>
        </Modal>

        <Pagination
          users={users}
          pageSize={this.state.pageSize}
          loading={this.props.loading}
          // pageCount={this.state.pageCount}
          currentPage={this.state.currentPage}
          updatePage={this.updatePage}
        />
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
