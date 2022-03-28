import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { editProfile } from "../../actions/queries";
import variables from "../../design-tokens/_variables.module.scss";
import * as SForm from "../sharedStyles/formStyles";
import { profileValidator } from "./helpers";
import { Container, Row, Col } from "reactstrap";
import { capitalizeFirstLetter } from "../../screens/Profile/helpers";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Form: styled(FForm)`
    width: 50%;
    background: white;
    padding: 5%;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
};

const Profile = () => {
  const [successText, setSuccessText] = useState("");

  const { data: session } = useSession();
  const user = session.user;

  const {
    first_name = "",
    last_name = "",
    email = "",
    phone_number = "",
    date_of_birth = "",
    zip_code = "",
    total_hours = "",
    address = "",
    city = "",
    state = "",
    court_required = false,
  } = user?.bio ?? {};

  return (
    <Styled.Container>
      <Formik
        initialValues={{
          first_name,
          last_name,
          email,
          phone_number,
          date_of_birth,
          zip_code,
          total_hours,
          address,
          city,
          state,
        }}
        onSubmit={(values, { setSubmitting }) => {
          const profileData = { bio: values };
          setSubmitting(true);
          editProfile(user._id, profileData)
            .then()
            .catch(console.log())
            .finally(() => {
              setSubmitting(false);
              setSuccessText("Profile updated successfully!");
              setTimeout(() => {
                setSuccessText("");
              }, 5000);
            });
        }}
        validationSchema={profileValidator}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <>
            <Styled.Form>
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
              <p>{successText}</p>
              <Container>
                <SForm.FormGroup>
                  <Row>
                    <Col>
                      <SForm.Label>First Name</SForm.Label>
                      <Styled.ErrorMessage name="first_name" />
                      <Field name="first_name">
                        {({ field }) => <SForm.Input disabled {...field} type="text" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>Last Name</SForm.Label>
                      <Styled.ErrorMessage name="last_name" />
                      <Field name="last_name">
                        {({ field }) => <SForm.Input disabled {...field} type="text" />}
                      </Field>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <SForm.Label>Email</SForm.Label>
                      <Styled.ErrorMessage name="email" />
                      <Field name="email">
                        {({ field }) => <SForm.Input disabled {...field} type="email" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>Phone</SForm.Label>
                      <Styled.ErrorMessage name="phone_number" />
                      <Field name="phone_number">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <SForm.Label>Date of Birth</SForm.Label>
                      <Styled.ErrorMessage name="date_of_birth" />
                      <Field name="date_of_birth">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>

                    <Col>
                      <SForm.Label>Zip Code</SForm.Label>
                      <Styled.ErrorMessage name="zip_code" />
                      <Field name="zip_code">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    { (user.role == "volunteer") ?  
                    <Col>
                      <SForm.Label>Total Hours</SForm.Label>
                      <Styled.ErrorMessage name="total_hours" />
                      <Field name="total_hours">
                        {({ field }) => <SForm.Input disabled {...field} type="text" />}
                      </Field>
                    </Col> : <Col></Col> 
                    }
                    {/* <Col>
                      <SForm.Label>Court Required</SForm.Label>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                    </Col> */}
                  </Row>

                  <Row>
                    <Col>
                      <SForm.Label>Address</SForm.Label>
                      <Styled.ErrorMessage name="address" />
                      <Field name="address">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>City</SForm.Label>
                      <Styled.ErrorMessage name="city" />
                      <Field name="city">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                    <Col>
                      <SForm.Label>State</SForm.Label>
                      <Styled.ErrorMessage name="state" />
                      <Field name="state">
                        {({ field }) => <SForm.Input {...field} type="text" />}
                      </Field>
                    </Col>
                  </Row>
                </SForm.FormGroup>
                <Col>
                  <Button
                    // color="variables.primary"
                    style={{ backgroundColor: "#ef4e79", float: "right" }}
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  >
                    Update
                  </Button>
                </Col>
              </Container>
            </Styled.Form>
          </>
        )}
      </Formik>
    </Styled.Container>
  );
};

export default Profile;
