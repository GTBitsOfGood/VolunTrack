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
import { updateUser } from "../../actions/queries";
import { Profiler } from "react";
import { profileValidator } from "./helpers";
import { capitalizeFirstLetter } from "../../screens/Profile/helpers";

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

class ProfileTable extends React.Component {
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
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
    });
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
  };

  render() {
    const { user, loading } = this.props;
    console.log("hi" + user.bio.first_name);
    return (
      <Table.Container style={{ width: "50%", "max-width": "none" }}>
        {loading && <Loading />}
        <Container>
          <ModalBody>
            <p
              style={{
                margin: "0px",
                color: "#7F1C3B",
                width: "240px",
                "font-size": "24px",
                "font-weight": "800",
              }}
            >{`${user.bio?.first_name} ${user.bio?.last_name}`}</p>
            <p style={{ margin: "0px" }}>{`${capitalizeFirstLetter(
              user.role ?? ""
            )}`}</p>
            <form>
              <Form.FormGroup>
                <Row>
                  <Col>
                    <Form.Label>First Name</Form.Label>
                    <Form.Input
                      defaultValue={user.bio ? user.bio.first_name : ""}
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
                      defaultValue={user.bio ? user.bio.last_name : ""}
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
                      defaultValue={user.bio ? user.bio.email : ""}
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
                  <Col></Col>
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
      </Table.Container>
    );
  }
}

export default ProfileTable;

ProfileTable.propTypes = {
  user: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
};
