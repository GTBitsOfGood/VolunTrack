import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, ModalBody, Row } from "reactstrap";
import styled from "styled-components";
import { updateUser } from "../../actions/queries";
import * as Form from "../sharedStyles/formStyles";
import { capitalizeFirstLetter } from "./helpers";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
  Container: styled.div`
    width: 60vw;
    max-width: 96rem;
    margin: auto;

    background: white;
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

const Profile = () => {
  const {
    data: { user },
  } = useSession();

  const [formFields, setFormFields] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(
      user.bio.email,
      formFields.firstName ?? user.bio.first_name,
      formFields.lastName ?? user.bio.last_name,
      formFields.phoneNumber ?? user.bio.phone_number,
      formFields.dateOfBirth ?? user.bio.date_of_birth,
      formFields.zip ?? user.bio.zip_code,
      formFields.address ?? user.bio.address,
      formFields.city ?? user.bio.city,
      formFields.state ?? user.bio.state,
      formFields.notes ?? user.bio.notes
    );
  };

  return (
    <Styled.Container>
      <Container>
        {user && (
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
            </Styled.HeaderContainer>
            <form>
              <Form.FormGroup>
                <Row>
                  <Col>
                    <Form.Label>First Name</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.first_name ?? ""}
                      type="text"
                      name="Name"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.last_name ?? ""}
                      type="text"
                      name="Name"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          lastName: e.target.value,
                        })
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
                      defaultValue={user.bio?.phone_number ?? ""}
                      type="text"
                      name="Phone"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.date_of_birth ?? ""}
                      type="text"
                      name="Date of Birth"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.zip_code ?? ""}
                      type="text"
                      name="Zip Code"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          zip: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Address</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.address ?? ""}
                      type="text"
                      name="Address"
                      onChange={(e) =>
                        setFormFields({
                          ...formFields,
                          address: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>City</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.city ?? ""}
                      type="text"
                      name="City"
                      onChange={(e) =>
                        setFormFields({ ...formFields, city: e.target.value })
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>State</Form.Label>
                    <Form.Input
                      defaultValue={user.bio?.state ?? ""}
                      type="text"
                      name="State"
                      onChange={(e) =>
                        setFormFields({ ...formFields, state: e.target.value })
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  {user.role === "admin" && (
                    <Col>
                      <Form.Label>Notes</Form.Label>
                      <Form.Input
                        defaultValue={user.bio?.notes ?? ""}
                        type="textarea"
                        onChange={(e) =>
                          setFormFields({
                            ...formFields,
                            notes: e.target.value,
                          })
                        }
                      />
                    </Col>
                  )}
                </Row>
                <Row
                  style={{
                    "margin-top": "1.5rem",
                  }}
                >
                  <Col></Col>
                  <Button
                    style={{ backgroundColor: "#ef4e79" }}
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </Row>
              </Form.FormGroup>
            </form>
          </ModalBody>
        )}
      </Container>
    </Styled.Container>
  );
};

export default Profile;
