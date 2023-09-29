import { Button, Label, TextInput, Tooltip } from "flowbite-react";
import BoGButton from "./BoGButton";
import InputField from "./Forms/InputField";
import styled from "styled-components";
import { InformationCircleIcon, DeleteIcon } from "@heroicons/react/24/solid";

import { ErrorMessage, Field, Formik } from "formik";

import { router, useRouter, withRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { createOrganization } from "../queries/organizations";
import { useState } from "react";
import { createOrganizationValidator } from "../screens/Onboarding/helpers";

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
    color: #e3242b;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
};

const goToLogin = () => {
  router.push("/login");
};

const LandingPage = () => {
  const [pages, setPages] = useState(1);

  const goNextPage = () => {
    setPages(pages + 1);
  };

  const handleSubmit = async (values) => {
    createOrganization(values);
    this.props.context.startLoading();
    this.props.context.success(
      "You have successfully submitted your application!"
    );
  };

  return (
    <div>
      <div className="flex h-[100vh] flex-col justify-between">
        {/* <div className="grotesk space-around mb-16 mt-6 flex flex-row items-center justify-between px-4 py-4 sm:mx-0 sm:mb-20 sm:px-0 md:px-6"> */}
        <div className="mt-4 flex flex-row justify-between self-stretch pb-4 pl-16 pt-6">
          <a
            href="/"
            className="flex align-middle text-3xl font-bold text-purple-700"
          >
            VolunTrack
          </a>
          <div className="flex hidden w-[25%] justify-between pl-14 md:flex md:w-[35%]">
            <a
              href="/"
              className="flex self-center align-middle text-xl text-black"
            >
              About
            </a>
            <a
              href="/"
              className="flex self-center align-middle text-xl text-black"
            >
              Contact Us
            </a>
          </div>
          <Button
            onClick={goToLogin}
            className="mr-16 flex bg-purple-700 align-middle hover:bg-purple-700"
            size="lg"
            outline
            pill
            type="button"
          >
            Log In
          </Button>
        </div>
        <div className="flex h-5/6 flex-row items-stretch justify-around">
          <div className="flex flex-col pt-4">
            <p className="w-fit self-center border-b-4 border-purple-700 text-3xl">
              Simplify Volunteer Coordination
            </p>
            <p className="ml-4 border-purple-700 text-xl">
              Create your account to get started with our volunteer management
              system
            </p>
            <>
              <hr className="mb-12 mt-4"></hr>
              <Formik
                initialValues={{
                  name: "",
                  website: "",
                  defaultContactName: "",
                  defaultContactEmail: "",
                  defaultContactPhone: "",
                  originalAdminEmail: "",
                  confirm_admin_email: "",
                  slug: "",
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
                      {pages === 2 && (
                        <>
                          <div className="m-auto flex flex-col">
                            <div className="mb-2 mt-4 flex flex-row self-center text-2xl font-bold text-purple-700">
                              Non-profit Information
                            </div>
                            <p className="border-purple-700 text-xl">
                              Used to verify your organization. We may ask you
                              for more information if needed.
                            </p>
                          </div>

                          <div className="m-auto flex w-64 flex-col">
                            <p>Non-profit Name</p>
                            <InputField
                              name="name"
                              placeholder="Non-profit Name"
                            />
                            <InputField
                              name="website"
                              label="Non-profit Website"
                              placeholder="https://www.example.com"
                            />
                            <Button
                              onClick={goNextPage}
                              className="flex self-center self-stretch bg-purple-700 align-middle hover:bg-purple-700"
                              size="lg"
                              outline
                              pill
                              type="button"
                            >
                              Next
                            </Button>
                          </div>
                        </>
                      )}
                      {pages === 1 && (
                        <>
                          <div className="m-auto flex flex-col">
                            <div className="mb-2 mt-4 flex flex-row self-center text-2xl font-bold text-purple-700">
                              Contact Information
                            </div>
                            <p className="border-purple-700 text-xl">
                              Create your account to get started with our
                              volunteer management system
                            </p>
                          </div>
                          <div className="m-auto flex w-64 flex-col">
                            <InputField
                              name="defaultContactName"
                              label="Contact Name"
                              placeholder="Contact Name"
                            />
                            <InputField
                              name="defaultContactEmail"
                              label="Contact Email"
                              placeholder="example@email.com"
                            />
                            <InputField
                              name="defaultContactPhone"
                              label="Phone"
                              placeholder="xxx-xxx-xxxx"
                            />
                            <Button
                              onClick={goNextPage}
                              className="flex self-center self-stretch bg-purple-700 align-middle hover:bg-purple-700"
                              size="lg"
                              outline
                              pill
                              type="button"
                            >
                              Next
                            </Button>
                          </div>
                        </>
                      )}
                      {pages === 3 && (
                        <>
                          <div className="m-auto flex flex-col">
                            <div className="mb-2 mt-4 flex flex-row self-center text-2xl font-bold text-purple-700">
                              Volunteer Management Information
                            </div>
                            <p className="border-purple-700 text-xl">
                              Used as important information to generate your
                              volunteer management platform.
                            </p>
                          </div>

                          <div className="m-auto w-64">
                            <Tooltip
                              className="flex flex-row"
                              content="Provide an email address that you wish to
                                be used to create the main volunteer administrator account. 
                                The main volunteer administrator account cannot be changed. It will have the
                                highest permission level on this
                                platform."
                            >
                              <div className="flex flex-row self-center">
                                Primary Admin Account
                                <InformationCircleIcon className="ml-1 flex w-4"></InformationCircleIcon>
                              </div>
                            </Tooltip>
                            <InputField
                              name="originalAdminEmail"
                              //label="Primary Admin Account"
                              placeholder="example@email.com"
                            />
                            <InputField
                              name="confirm_admin_email"
                              label="Confirm Primary Admin Account"
                              placeholder="example@email.com"
                            />
                          </div>

                          <div className="m-auto w-80">
                            <Tooltip
                              className="flex flex-row"
                              content="Please customize your link to
                              your volunteer management platform. Note: Your
                              custom code 
                              must contain
                              3-20 letters or numbers. Please do not
                              use spaces, symbols, or special characters."
                            >
                              <div className="flex flex-row self-center">
                                <Label className="mb-3 mt-4" htmlFor="slug">
                                  Non-profit Code
                                </Label>
                                <InformationCircleIcon className="ml-1 flex w-4"></InformationCircleIcon>
                              </div>
                            </Tooltip>

                            <Field className="flex justify-center" name="slug">
                              {({ field }) => (
                                <TextInput
                                  {...field}
                                  type="text"
                                  addon="https://volunteer.bitsofgood.org/"
                                  placeholder={values.name
                                    .toLowerCase()
                                    .replace(" ", "-")}
                                />
                              )}
                            </Field>
                            <Styled.ErrorMessage name="slug" />
                            <div className="mb-12 mt-5 flex justify-center">
                              <Button
                                onClick={handleSubmit}
                                className="flex self-center self-stretch bg-purple-700 align-middle hover:bg-purple-700"
                                size="lg"
                                outline
                                pill
                                type="button"
                                text="Submit"
                                disabled={!isValid || isSubmitting}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                )}
              </Formik>
            </>
          </div>
          <div className="flex h-[100%] flex-col self-stretch">
            <img src={"/images/Landing Page Example.png"} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
