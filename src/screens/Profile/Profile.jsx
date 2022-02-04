import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { editProfile } from "../../actions/queries";
import * as SForm from "../sharedStyles/formStyles";
import { profileValidator } from "./helpers";

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
  } = user?.bio ?? {};

  return (
    <Styled.Container>
      <p>Edit Profile</p>
      <Formik
        initialValues={{
          first_name,
          last_name,
          email,
          phone_number,
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
              <p>{successText}</p>
              <SForm.FormGroup>
                <SForm.Label>First Name</SForm.Label>
                <Styled.ErrorMessage name="first_name" />
                <Field name="first_name">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>

                <SForm.Label>Last Name</SForm.Label>
                <Styled.ErrorMessage name="last_name" />
                <Field name="last_name">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>

                <SForm.Label>Email</SForm.Label>
                <Styled.ErrorMessage name="email" />
                <Field name="email">
                  {({ field }) => <SForm.Input {...field} type="email" />}
                </Field>

                <SForm.Label>Phone Number</SForm.Label>
                <Styled.ErrorMessage name="phone_number" />
                <Field name="phone_number">
                  {({ field }) => <SForm.Input {...field} type="text" />}
                </Field>
              </SForm.FormGroup>
              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                Submit
              </Button>
            </Styled.Form>
          </>
        )}
      </Formik>
    </Styled.Container>
  );
};

export default Profile;
