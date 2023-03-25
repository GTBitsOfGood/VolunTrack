import PropTypes from "prop-types";
import { Button, Col, Container, Row } from "reactstrap";
import * as SForm from "../../screens/sharedStyles/formStyles";
import { Formik, Form } from "formik";
import InputField from "./InputField";
import React from "react";

class EditUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.userSelectedForEdit,
    };
  }
  render() {
    if (this.props.userSelectedForEdit) {
      return (
        <Formik
          enableReinitialize
          initialValues={this.props.userSelectedForEdit}
          onSubmit={this.props.submitHandler}
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
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                  <Col>
                    <InputField
                      name={"last_name"}
                      label={"Last Name"}
                      isRequired={true}
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <InputField
                      name={"email"}
                      label={"Email"}
                      isRequired={true}
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                  <Col>
                    <InputField
                      name={"phone_number"}
                      label={"Phone"}
                      isRequired={false}
                      disabled={this.props.disableEdit}
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
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                  <Col>
                    <InputField
                      name={"zip_code"}
                      label={"Zip Code"}
                      isRequired={false}
                      disabled={this.props.disableEdit}
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
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                  <Col>
                    <InputField
                      name={"city"}
                      label={"City"}
                      isRequired={false}
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                  <Col>
                    <InputField
                      name={"state"}
                      label={"State"}
                      isRequired={false}
                      disabled={this.props.disableEdit}
                      type={"text"}
                    />
                  </Col>
                </Row>
                <Row>
                  {this.props.isAdmin && (
                    <Col>
                      <InputField
                        name={"notes"}
                        label={"Notes"}
                        isRequired={false}
                        disabled={this.props.disableEdit}
                        type={"text"}
                      />
                    </Col>
                  )}
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
              {this.props.isPopUp && (
                <Button color="secondary" onClick={this.props.closePopUp}>
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
  }
}

EditUserForm.propTypes = {
  userSelectedForEdit: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  isPopUp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.string.isRequired,
  closePopUp: PropTypes.func,
  disableEdit: PropTypes.bool.isRequired,
};

export default EditUserForm;
