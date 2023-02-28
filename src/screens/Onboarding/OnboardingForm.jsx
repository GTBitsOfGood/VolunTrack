import { ErrorMessage, Field, Formik } from "formik";
import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import Image from "next/image";
import { Label as Label, TextInput, Button } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { createOrganization } from "../../actions/queries";

const Styled = {
  Container: styled.div`
    display: flex;
    padding: 4em;
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
  Button: styled(Button)`
    background-color: #F05C61
    padding: 14px 40px;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
};

class OnboardingForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = async (values) => {
    createOrganization(values);
    this.props.context.startLoading();
    this.props.context.success(
      "You have successfully submitted your application!"
    );
  };

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
            organization_name: "",
            website_url: "",
            contact_name: "",
            contact_email: "",
            contact_phone: "",
            admin_email: "",
            confirm_admin_email: "",
            organization_code: "",
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            this.handleSubmit(values);
            setSubmitting(false);
            resetForm();
          }}
          validationSchema={createOrganizationValidator}
        >
          {({ handleSubmit, isValid, isSubmitting, values }) => (
            <div className="flex justify-center">
              <form>
                <div className="m-auto">
                  <Styled.Header2 className="flex justify-center">
                    Non-profit Information
                  </Styled.Header2>
                  <Styled.Subtitle className="flex justify-center">
                    Used to verify your organization. We may ask you for more
                    information if needed.
                  </Styled.Subtitle>
                </div>
                <div className="w-64 m-auto mt-5">
                  <InputField
                    className="flex justify-center"
                    name="organization_name"
                    label="Non-profit Name"
                    placeholder="Non-profit Name"
                  />
                  <InputField
                    className="flex justify-center"
                    name="website_url"
                    label="Non-profit Website"
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="m-auto">
                  <Styled.Header2 className="flex justify-center">
                    Contact Information
                  </Styled.Header2>
                  <Styled.Subtitle className="flex justify-center">
                    We will use this to contact you if we need more information
                    or update you with the approval.
                  </Styled.Subtitle>
                </div>
                <div className="w-64 m-auto">
                  <InputField
                    className="flex justify-center"
                    name="contact_name"
                    label="Contact Name"
                    placeholder="Contact Name"
                  />
                  <InputField
                    className="flex justify-center"
                    name="contact_email"
                    label="Contact Email"
                    placeholder="example@email.com"
                  />
                  <InputField
                    className="flex justify-center"
                    name="contact_phone"
                    label="Phone"
                    placeholder="xxx-xxx-xxxx"
                  />
                </div>
                <div className="mb-5 m-auto">
                  <Styled.Header2 className="flex justify-center">
                    Volunteer Management Information
                  </Styled.Header2>
                  <Styled.Subtitle className="flex justify-center">
                    Used as important information to generate your volunteer
                    management platform.
                  </Styled.Subtitle>
                  <Styled.Subtitle2 className="flex justify-center">
                    * Please provide an email address that you wish to be used
                    to create the main volunteer administrator (Admin) account.{" "}
                    <br />
                    The main volunteer administrator account cannot be changed.
                    It will have the highest permission level on this platform.
                  </Styled.Subtitle2>
                </div>
                <div className="w-64 m-auto">
                  <InputField
                    className="flex justify-center"
                    name="admin_email"
                    label="Primary Admin Account"
                    placeholder="example@email.com"
                  />
                  <InputField
                    className="flex justify-center"
                    name="confirm_admin_email"
                    label="Confirm Primary Admin Account"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="m-auto mb-5">
                  <Styled.Subtitle2 className="flex justify-center">
                    * Please customize your nonprofit code for your volunteer
                    management platform. <br />
                    Note: Your custom code must contain 3-20 letters or numbers.
                    Please do not use spaces, symbols, or special characters.
                  </Styled.Subtitle2>
                </div>
                <div className="w-80 m-auto">
                  <Label className="mt-2 mb-1" htmlFor="organization_code">
                    Non-profit Code
                  </Label>
                  <Field
                    className="flex justify-center"
                    name="organization_code"
                  >
                    {({ field }) => (
                      <TextInput
                        {...field}
                        type="text"
                        addon="volunteer.bitsofgood.org/"
                        placeholder={values.organization_name
                          .toLowerCase()
                          .replace(" ", "-")}
                      />
                    )}
                  </Field>
                  <Styled.ErrorMessage name="organization_code" />
                </div>
                <div className="m-auto flex justify-center mt-5">
                  <Button
                    className="bg-pink-600"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </>
    );
  }
}

export default OnboardingForm;

OnboardingForm.propTypes = {
  context: PropTypes.object.isRequired,
};
