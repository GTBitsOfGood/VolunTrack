import { ErrorMessage, Field, Formik } from "formik";
import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";
import Image from "next/image";
import { Label as Label, TextInput } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { createOrganization } from "../../actions/queries";
import BoGButton from "../../components/BoGButton";

const Styled = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  Header: styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    align-items: center;
    margin: 0;
    justify-content: center;
  `,
  Subtitle: styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #637381;
  `,
  Header2: styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    color: #f05c61;
  `,
  Subtitle2: styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
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
            src="/images/bog_hack4impact_logo.png"
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
        <hr class="mb-12 mt-4"></hr>
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
            <div className="flex flex-col justify-center">
              <form>
                <div className="m-auto">
                  <Styled.Header2 className="flex justify-center">
                    Non-profit Information
                  </Styled.Header2>
                  <Styled.Subtitle className="mb-4 flex justify-center">
                    Used to verify your organization. We may ask you for more
                    information if needed.
                  </Styled.Subtitle>
                </div>
                <div className="m-auto flex w-64 flex-col">
                  <p>Non-profit Name</p>
                  <InputField
                    name="organization_name"
                    placeholder="Non-profit Name"
                  />
                  <InputField
                    name="website_url"
                    label="Non-profit Website"
                    placeholder="https://www.example.com"
                  />
                </div>
                <div className="m-auto">
                  <Styled.Header2 className="mt-4 flex justify-center">
                    Contact Information
                  </Styled.Header2>
                  <Styled.Subtitle className="mb-4 flex justify-center">
                    We will use this to contact you if we need more information
                    or update you with the approval.
                  </Styled.Subtitle>
                </div>
                <div className="m-auto w-64">
                  <InputField
                    name="contact_name"
                    label="Contact Name"
                    placeholder="Contact Name"
                  />
                  <InputField
                    name="contact_email"
                    label="Contact Email"
                    placeholder="example@email.com"
                  />
                  <InputField
                    name="contact_phone"
                    label="Phone"
                    placeholder="xxx-xxx-xxxx"
                  />
                </div>
                <div className="m-auto text-center">
                  <Styled.Header2 className="mt-10">
                    Volunteer Management Information
                  </Styled.Header2>
                  <Styled.Subtitle>
                    Used as important information to generate your volunteer
                    management platform.
                  </Styled.Subtitle>
                  <Styled.Subtitle2 className="mx-3.5 mt-4 mb-4">
                    * Please provide an email address that you wish to be used
                    to create the main volunteer administrator (Admin) account.{" "}
                    <br />
                    The main volunteer administrator account&nbsp;
                    <b>cannot be changed.</b>&nbsp;It will have the
                    <b>&nbsp;highest permission level</b>&nbsp;on this platform.
                  </Styled.Subtitle2>
                </div>
                <div className="m-auto w-64">
                  <InputField
                    name="admin_email"
                    label="Primary Admin Account"
                    placeholder="example@email.com"
                  />
                  <InputField
                    name="confirm_admin_email"
                    label="Confirm Primary Admin Account"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="m-auto text-center">
                  <Styled.Subtitle2 className="mx-3.5 mt-4">
                    * Please&nbsp;<b>customize your link</b>&nbsp;to your
                    volunteer management platform. Note: Your custom code <br />
                    must contain&nbsp;
                    <b>3-20 letters or numbers.</b>&nbsp;Please do not use
                    spaces, symbols, or special characters.
                  </Styled.Subtitle2>
                </div>
                <div className="m-auto w-80">
                  <Label className="mb-3 mt-4" htmlFor="organization_code">
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
                        addon="https://volunteer.bitsofgood.org/"
                        placeholder={values.organization_name
                          .toLowerCase()
                          .replace(" ", "-")}
                      />
                    )}
                  </Field>
                  <Styled.ErrorMessage name="organization_code" />
                </div>
                <div className="mb-12 mt-5 flex justify-center">
                  <BoGButton
                    text="Submit"
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
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

export default OnboardingForm;

OnboardingForm.propTypes = {
  context: PropTypes.object.isRequired,
};
