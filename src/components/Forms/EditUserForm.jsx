import PropTypes from "prop-types";
import { Button, Col, Container, Row } from "reactstrap";
import * as SForm from "../../screens/sharedStyles/formStyles";
import { Formik, Form } from "formik";
import InputField from "./InputField";

const EditUserForm = (props) => {
  if (props.userSelectedForEdit) {
    return (
      <Formik
        enableReinitialize
        initialValues={props.userSelectedForEdit}
        onSubmit={props.submitHandler}
      >
        <Form>
          <Container>
            <SForm.FormGroup>
              <Row>
                <Col>
                  <InputField
                    name={"first_name"}
                    label={"First Name"}
                    isRequired={true}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
                <Col>
                  <InputField
                    name={"last_name"}
                    label={"Last Name"}
                    isRequired={true}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputField
                    name={"email"}
                    label={"Email"}
                    isRequired={true} // does not seem to work
                    disabled={true} // update based on permissions
                    type={"text"}
                  />
                </Col>
                <Col>
                  <InputField
                    name={"phone_number"}
                    label={"Phone"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputField
                    name={"date_of_birth"}
                    label={"Date of Birth"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
                <Col>
                  <InputField
                    name={"zip_code"}
                    label={"Zip Code"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputField
                    name={"address"}
                    label={"Address"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
                <Col>
                  <InputField
                    name={"city"}
                    label={"City"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
                <Col>
                  <InputField
                    name={"state"}
                    label={"State"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputField
                    name={"notes"}
                    label={"Notes"}
                    isRequired={false}
                    disabled={false} // update based on permissions
                    type={"text"}
                  />
                </Col>
              </Row>
            </SForm.FormGroup>
          </Container>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            {props.isPopUp && (
              <Button color="secondary" onClick={props.closePopUp}>
                Cancel
              </Button>
            )}
            <Button type="submit" style={{ backgroundColor: "#ef4e79" }}>
              Update
            </Button>
          </div>
        </Form>
      </Formik>
    );
  } else {
    return null;
  }
};

EditUserForm.propTypes = {
  userSelectedForEdit: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isPopUp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.string.isRequired,
  closePopUp: PropTypes.func,
};

export default EditUserForm;
