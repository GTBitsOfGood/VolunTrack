import { Table } from "flowbite-react";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import { Icon } from "../../components/Icon";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import BoGButton from "../../components/BoGButton";

import * as SForm from "../sharedStyles/formStyles";

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

class VolunteerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
      modalOpen: false,
      currentPage: 0,
      pageSize: 10,
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
      modalOpen: true,
    });
  };

  deleteUser = (id) => {
    // deleteUser(id);
    this.props.deleteUserCallback(id);
  };

  onModalClose = () => {
    this.setState({
      userSelectedForEdit: null,
      modalOpen: false,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  handleSubmit = (values) => {
    this.props.editUserCallback(this.state.userSelectedForEdit?._id, values);
    this.onModalClose();
  };

  render() {
    const { users, loading } = this.props;
    return (
      <div>
        <Table striped={true}>
          <Table.Head className="dark:border-red-700">
            <Table.HeadCell className="text-primaryColor">
              Volunteer Name
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
                  {user.phone_number
                    ? user.phone_number.substr(0, 3) +
                      "-" +
                      user.phone_number.substr(3, 3) +
                      "-" +
                      user.phone_number.substr(6, 4)
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  <Styled.Button
                    onClick={() => this.onDisplayEditUserModal(user)}
                  >
                    <Icon color="grey3" name="create" />
                  </Styled.Button>
                  {/*<Styled.Button onClick={() => this.deleteUser(user._id)}>*/}
                  {/*  <Icon color="grey3" name="delete" />*/}
                  {/*</Styled.Button>*/}
                  <Link href={`stats/${user._id}`}>
                    <Styled.Button>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_2204_28336)">
                          <path
                            d="M5.04892 17.99L10.2446 12.7856L13.7084 16.2494L21.0689 7.97098L19.848 6.75L13.7084 13.6516L10.2446 10.1878L3.75 16.6911L5.04892 17.99Z"
                            fill="#960034"
                          />
                          <line
                            x1="0.975"
                            y1="1"
                            x2="0.975"
                            y2="22.5"
                            stroke="#960034"
                            strokeWidth="1.7"
                          />
                          <line
                            x1="0.25"
                            y1="21.65"
                            x2="22.75"
                            y2="21.65"
                            stroke="#960034"
                            strokeWidth="1.7"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2204_28336">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Styled.Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          {loading && <Loading />}
          <Formik
            enableReinitialize
            initialValues={{
              first_name: this.state.userSelectedForEdit?.first_name ?? "",
              last_name: this.state.userSelectedForEdit?.last_name ?? "",
              email: this.state.userSelectedForEdit?.email ?? "",
              phone_number: this.state.userSelectedForEdit?.phone_number ?? "",
              date_of_birth:
                this.state.userSelectedForEdit?.date_of_birth ?? "",
              zip_code: this.state.userSelectedForEdit?.zip_code ?? "",
              address: this.state.userSelectedForEdit?.address ?? "",
              city: this.state.userSelectedForEdit?.city ?? "",
              state: this.state.userSelectedForEdit?.state ?? "",
              notes: this.state.userSelectedForEdit?.notes ?? "",
            }}
            onSubmit={(values) => {
              this.handleSubmit(values);
            }}
          >
            <Modal style={{ maxWidth: "750px" }} isOpen={this.state.modalOpen}>
              <Form>
                <ModalHeader color="#ef4e79">
                  {this.state.userSelectedForEdit?.name ?? ""}
                </ModalHeader>
                <Container>
                  <ModalBody>
                    <SForm.FormGroup>
                      <Row>
                        <Col>
                          <SForm.Label>First Name</SForm.Label>
                          <Field name="first_name">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                        <Col>
                          <SForm.Label>Last Name</SForm.Label>
                          <Field name="last_name">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <SForm.Label>Email</SForm.Label>
                          <Field name="email">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                        <Col>
                          <SForm.Label>Phone</SForm.Label>
                          <Field name="phone_number">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <SForm.Label>Date of Birth</SForm.Label>
                          <Field name="date_of_birth">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                        <Col>
                          <SForm.Label>Zip Code</SForm.Label>
                          <Field name="zip_code">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <SForm.Label>Address</SForm.Label>
                          <Field name="address">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                        <Col>
                          <SForm.Label>City</SForm.Label>
                          <Field name="city">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                        <Col>
                          <SForm.Label>State</SForm.Label>
                          <Field name="state">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <SForm.Label>Notes</SForm.Label>
                          <Field name="notes">
                            {({ field }) => (
                              <SForm.Input {...field} type="text" />
                            )}
                          </Field>
                        </Col>
                      </Row>
                    </SForm.FormGroup>
                  </ModalBody>
                </Container>
                <ModalFooter>
                  <BoGButton onClick={this.onModalClose} text="Cancel" outline={true}/>
                  {/*TODOCD: Figure out Formik button of type submit}*/}
                  <Button type="submit" style={{ backgroundColor: "#ef4e79" }}>
                    Update
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          </Formik>
        </Table>
        {users.length !== 0 && (
          <Pagination
            items={users}
            pageSize={this.state.pageSize}
            loading={this.props.loading}
            currentPage={this.state.currentPage}
            updatePageCallback={this.updatePage}
          />
        )}
      </div>
    );
  }
}

export default VolunteerTable;

VolunteerTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
};
