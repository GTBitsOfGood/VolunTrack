import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Loading from "../../components/Loading";
import * as Form from "../sharedStyles/formStyles";
import * as Table from "../sharedStyles/tableStyles";
import { Container, Row, Col } from "reactstrap";
import styled from "styled-components";
import Icon from "../../components/Icon";
import { updateUser } from "../../actions/queries";
import { Profiler } from "react";
import { capitalizeFirstLetter } from "../../screens/Profile/helpers";
import { useState } from "react";

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
  HeaderContainer: styled.div`
    margin-bottom: 2rem;
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
      visibleText: false,
    };
  }

  // onDisplayEditUserModal = (userToEdit) => {
  //   this.setState({
  //     userSelectedForEdit: userToEdit,
  //   });
  // };

  handleSubmit = async (e) => {
    this.setState({
      visibleText: true,
    });
    e.preventDefault();
    await updateUser(
      this.props.user.bio.email,
      this.props.user.bio && this.state.first_name
        ? this.state.first_name
        : this.props.user.bio.first_name,
      this.props.user.bio && this.state.last_name
        ? this.state.last_name
        : this.props.user.bio.last_name,
      this.props.user.bio && this.state.phone_number
        ? this.state.phone_number
        : this.props.user.bio.phone_number,
      this.props.user.bio && this.state.date_of_birth
        ? this.state.date_of_birth
        : this.props.user.bio.date_of_birth,
      this.props.user.bio && this.state.zip_code
        ? this.state.zip_code
        : this.props.user.bio.zip_code,
      this.props.user.bio && this.state.total_hours
        ? this.state.total_hours
        : this.props.user.bio.total_hours,
      this.props.user.bio && this.state.address
        ? this.state.address
        : this.props.user.bio.address,
      this.props.user.bio && this.state.city
        ? this.state.city
        : this.props.user.bio.city,
      this.props.user.bio && this.state.state
        ? this.state.state
        : this.props.user.bio.state,
      this.props.user.bio && this.state.court_hours
        ? this.state.court_hours
        : this.props.user.bio.court_hours,
      this.props.user.bio && this.state.notes
        ? this.state.notes
        : this.props.user.bio.notes
    );
  };

  render() {
    const { user } = this.props;

    return (
      <Table.Container
        style={{ width: "50%", "max-width": "none", padding: "3rem" }}
      >
        <Container>
          <ModalBody>
            <Styled.HeaderContainer>
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
              <p>
                {" "}
                {this.state.visibleText
                  ? "Profile is Successfully Updated!"
                  : ""}
              </p>
            </Styled.HeaderContainer>
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
                      defaultValue={user.bio ? user.bio.phone_number : ""}
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
                      defaultValue={user.bio ? user.bio.date_of_birth : ""}
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
                      defaultValue={user.bio ? user.bio.zip_code : ""}
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
                      disabled="disabled"
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
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Address</Form.Label>
                    <Form.Input
                      defaultValue={user.bio ? user.bio.address : ""}
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
                      defaultValue={user.bio ? user.bio.city : ""}
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
                      defaultValue={user.bio ? user.bio.state : ""}
                      type="text"
                      name="State"
                      onChange={(evt) =>
                        this.setState({ state: evt.target.value })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Court Required Hours</Form.Label>
                    <Form.Input
                      disabled="disabled"
                      defaultValue={user.bio ? user.bio.court_hours : ""}
                      type="text"
                      name="Court Hours"
                      onChange={(evt) =>
                        this.setState({ court_hours: evt.target.value })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Notes</Form.Label>
                    <Form.Input
                      defaultValue={user.bio ? user.bio.notes : ""}
                      type="textarea"
                      onChange={(evt) =>
                        this.setState({ notes: evt.target.value })
                      }
                    ></Form.Input>
                  </Col>
                </Row>
                <Row
                  style={{
                    "margin-top": "1.5rem",
                  }}
                >
                  <Col></Col>
                  <Button
                    style={{ backgroundColor: "#ef4e79" }}
                    onClick={this.handleSubmit}
                  >
                    Update
                  </Button>
                </Row>
              </Form.FormGroup>
            </form>
          </ModalBody>
        </Container>
        {/* <ModalFooter>
          <Button
            style={{ backgroundColor: "#ef4e79" }}
            onClick={this.handleSubmit}
          >
            Update
          </Button>
        </ModalFooter> */}
      </Table.Container>
    );
  }
}

export default ProfileTable;

ProfileTable.propTypes = {
  user: PropTypes.object.isRequired,
  editUserCallback: PropTypes.func.isRequired,
};
