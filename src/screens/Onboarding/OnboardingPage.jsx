import { Field, Formik } from "formik";
import { Button, Col, FormGroup as BFormGroup, Row } from "reactstrap";
import * as SForm from "../sharedStyles/formStyles";
import styled from "styled-components";
import React from "react";
import Image from "next/image";
import { Label as Label, TextInput } from "flowbite-react";

const Styled = {
  Container: styled.div`
    display: flex;
    padding: 4em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    justify-content: center;
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
    color: #f05c61;
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
};

class OnboardingPage extends React.Component {
  constructor(props) {
    super(props);
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
            src="/images/bog_hac4impact_logo.png"
          />

          <Styled.Header>
            Information Collection Form - Bits of Good Volunteer Management
            Platform
          </Styled.Header>
          <Styled.Subtitle>
            After submitting this form, Bits of Good will review your
            information soon. Once you are approved, our member will be in
            contact with you to help you establish the platform.
          </Styled.Subtitle>
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
            <div className="flex justify-center">
              <form>
                <div className="">
                  <Styled.Header2>Non-profit Information</Styled.Header2>
                  <Styled.Subtitle>
                    Used to verify your organization. We may ask you for more
                    information if needed.
                  </Styled.Subtitle>
                  <Label className="mt-2 mb-1" htmlFor="organizationName">
                    Non-profit Name
                  </Label>
                  <TextInput
                    id="organizationName"
                    placeholder="Non-profit Name"
                  />
                  <Label className="mt-2 mb-1" htmlFor="websiteUrl">
                    Non-profit Website
                  </Label>
                  <TextInput
                    id="websiteUrl"
                    placeholder="https://www.example.com"
                  />
                  <Styled.Header2>Contact Information</Styled.Header2>
                  <Styled.Subtitle>
                    We will use this to contact you if we need more information
                    or update you with the approval.
                  </Styled.Subtitle>

                  <Label className="mt-2 mb-1" htmlFor="contactName">
                    Contact Name
                  </Label>
                  <TextInput id="contactName" placeholder="Contact Name" />
                  <Label className="mt-2 mb-1" htmlFor="contactEmail">
                    Email
                  </Label>
                  <TextInput
                    id="conttactEmail"
                    placeholder="example@email.com"
                  />
                  <Label className="mt-2 mb-1" htmlFor="contactPhone">
                    Phone
                  </Label>
                  <TextInput id="contactPhone" placeholder="xxx-xxx-xxxx" />
                  <Styled.Header2>
                    Volunteer Management Information
                  </Styled.Header2>
                  <Styled.Subtitle>
                    Used as important information to generate your volunteer
                    management platform.
                  </Styled.Subtitle>
                  <Styled.Subtitle2>
                    * Please provide an email address that you wish to be used
                    to create the main volunteer administrator (Admin) account.{" "}
                    <br />
                    The main volunteer administrator account cannot be changed.
                    It will have the highest permission level on this platform.
                  </Styled.Subtitle2>
                  <Label className="mt-2 mb-1" htmlFor="adminEmail">
                    Primary Admin Account
                  </Label>
                  <TextInput id="adminEmail" placeholder="example@email.com" />
                  <Label className="mt-2 mb-1" htmlFor="confirmAdminEmail">
                    Confirm Primary Admin Account
                  </Label>
                  <TextInput placeholder="example@email.com" />
                  <Styled.Subtitle2>
                    * Please customize your nonprofit code for your volunteer
                    management platform. <br />
                    Note: Your custom code must contain 3-20 letters or numbers.
                    Please do not use spaces, symbols, or special characters.
                  </Styled.Subtitle2>
                  <Label className="mt-2 mb-1" htmlFor="organizationCode">
                    Non-profit Code
                  </Label>
                  <TextInput
                    id="organizationCode"
                    addon="volunteer.bitsofgood.org/"
                    placeholder="example123"
                  />
                </div>
              </form>
            </div>
          )}
        </Formik>
      </>
    );
  }
}

export default OnboardingPage;
