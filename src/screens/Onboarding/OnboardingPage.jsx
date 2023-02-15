import { Field, Formik } from "formik";
import { Button, Col, FormGroup as BFormGroup, Row } from "reactstrap";
import * as SForm from "../sharedStyles/formStyles";
import styled from "styled-components";
import React from "react";
import Image from "next/image";
import { Label, TextInput } from "flowbite-react";

const Styled = {
  Container: styled.div`
    display: flex;
    padding: 4em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  TopText: styled.p`
    font-size: 32px;
    font-weight: bold;
  `,
  OrDiv: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1.5vw;
  `,
  FormGroup: styled(BFormGroup)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  Header: styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
    align-items: center;
    justify-content:center;
  `,
  Subtitle: styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #637381;
  `,
  Header2: styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: #F05C61;
  `,
  Subtitle2: styled.div`
    position: absolute
    width: 686px;
    height: 72px;
    left: 376px;
    top: 1497px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  `,
  Label: styled.div`
    position: absolute
    width: 129px;
    height: 24px;
    left: 571px;
    top: 371px;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  `,
  TextInputContainer: styled.div`
    width: 297px;
    height: 54px;
    left: 571px;
    top: 407px;
  `,
};

class OnboardingPage extends React.Component{
  constructor(props) {
    super(props);
    this.error = false;

    let url = new URL(window.location.href);

    if (url.searchParams.has("error")) {
      this.props.context.startLoading();
      this.props.context.failed("Your username or password is incorrect.");
    }
  }

  render() {
    return (
      <>
        <Styled.Container>
          <Image
            objectFit="contain"
            height="158px"
            width="302px"
            layout="fixed"
            alt="Bits of Good Logo"
            src="/images/bog_hac4impact_logo.png"/>
        
        <Styled.Header>Information Collection Form - Bits of Good Volunteer Management Platform</Styled.Header>
        <Styled.Subtitle>After submitting this form, Bits of Good will review your information soon. Once you are approved, our member will be in contact with you to help you establish the platform.</Styled.Subtitle>
        </Styled.Container>
        <Formik
          initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          password_confirm: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          this.handleSubmit(values);
          setSubmitting(false);
          }}
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <div style={{ width: "100%" }}>
              <form>
                <Styled.FormGroup>
                  {/*<Row>*/}
                  {/*  <Field as="select" name="nonprofit">*/}
                  {/*    <option value="1">Helping Mamas</option>*/}
                  {/*    <option value="2">Nonprofit 2</option>*/}
                  {/*    <option value="3">Nonprofit 3</option>*/}
                  {/*  </Field>*/}
                  {/*</Row>*/}
                  <Styled.Header2>Non-profit Information</Styled.Header2>
                  <Styled.Subtitle>Used to verify your organization. We may ask you for more information if needed.</Styled.Subtitle>
                  <Styled.Label>Non-profit Name</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="Non-profit Name"/>
                  </Styled.TextInputContainer>
                  <Styled.Label>Non-profit Website</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="https://www.example.com"/>
                  </Styled.TextInputContainer>
                  <Styled.Header2>Contact Information</Styled.Header2>
                  <Styled.Subtitle>We will use this to contact you if we need more information or update you with the approval.</Styled.Subtitle>
                  <Styled.Header2>Volunteer Management Information</Styled.Header2>
                  <Styled.Label>Contact Name</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="Contact Name"/>
                  </Styled.TextInputContainer>
                  <Styled.Label>Email</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="example@email.com"/>
                  </Styled.TextInputContainer>
                  <Styled.Label>Phone</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="xxx-xxx-xxxx"/>
                  </Styled.TextInputContainer>
                  <Styled.Subtitle>Used as important information to generate your volunteer management platform.</Styled.Subtitle>
                  <Styled.Subtitle2>* Please provide an email address that you wish to be used to create the main volunteer administrator (Admin) account. <br/>The main volunteer administrator account cannot be changed. It will have the highest permission level on this platform.</Styled.Subtitle2>
                  <Styled.Label>Primary Admin Account</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="example@email.com"/>
                  </Styled.TextInputContainer>
                  <Styled.Label>Confirm Primary Contact Name</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="example@email.com"/>
                  </Styled.TextInputContainer>
                  <Styled.Subtitle2>*  Please customize your nonprofit code for your volunteer management platform. <br/>Note: Your custom code must contain 3-20 letters or numbers. Please do not use spaces, symbols, or special characters.</Styled.Subtitle2>
                  <Styled.Label>Non-profit Code</Styled.Label>
                  <Styled.TextInputContainer>
                    <TextInput placeholder="example123"/>
                  </Styled.TextInputContainer>
                </Styled.FormGroup>
              </form>
            </div>
          )}
        </Formik>
      </>
    )
  }
};

export default OnboardingPage;