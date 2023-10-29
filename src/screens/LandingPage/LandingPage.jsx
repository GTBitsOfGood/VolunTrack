import { Button, Label, TextInput, Tooltip } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { Field, Formik, ErrorMessage } from "formik";

import { router } from "next/router";
import { createOrganization } from "../../queries/organizations";
import React, { useState } from "react";
import { createOrganizationValidator } from "./helpers";
import AppFooter from "../../components/Footer";
import { features } from "./features";

const goToLogin = () => {
  router.push("/login");
};

const goToCreateAcc = () => {
  router.push("/create-account");
};

const LandingPage = () => {
  const [pages, setPages] = useState(1);

  const goNextPage = () => {
    setPages(pages + 1);
  };

  const goBackPage = () => {
    setPages(pages - 1);
  };

  const handleSubmit = async (values) => {
    createOrganization(values).then((res) => {
      if (res.status < 300) {
        // submission completed!
        setPages(4);
      } else {
        setPages(5);
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="h-fit bg-cover bg-center bg-no-repeat md:bg-[url('/images/background-art.png')]">
        <div className="flex h-fit flex-col justify-between md:min-h-screen">
          <div className="mb-8 ml-2 flex flex-row justify-between self-stretch pb-4 pt-6 md:pl-14">
            <div className="">
              <a
                href="/"
                className="flex align-middle text-3xl font-bold text-purple-700"
              >
                VolunTrack
              </a>
              <div className="ml-1 flex items-center">
                <span className="items-center">Created by</span>
                <img
                  src={"/images/bog.svg"}
                  alt="org logo"
                  className="ml-2 h-5"
                />
              </div>
            </div>
            <div className="hidden w-[40%] justify-evenly md:flex">
              <a
                href="/"
                className="flex self-center align-middle text-lg text-black"
              >
                Home
              </a>
              <a
                href="/"
                className="flex self-center align-middle text-lg text-black"
              >
                Product
              </a>
              <a
                href="https://bitsofgood.org/about"
                className="flex self-center align-middle text-lg text-black"
              >
                About
              </a>
              <a
                href="https://bitsofgood.org/contact"
                className="flex self-center align-middle text-lg text-black"
              >
                Contact
              </a>
            </div>
            <div className="flex flex-col items-end md:mr-24 md:flex-row md:items-center">
              <button
                onClick={goToLogin}
                className="mr-4 items-center text-purple-600 hover:text-purple-700 hover:underline"
                type="button"
              >
                Login
              </button>
              <Button
                onClick={goToCreateAcc}
                className="mr-2 flex border-0 bg-purple-600 align-middle hover:bg-purple-700"
                size="sm"
                type="button"
              >
                Create Volunteer Account
              </Button>
            </div>
          </div>
          <div className="flex h-5/6 flex-col items-stretch justify-around md:flex-row">
            <div className="flex w-full flex-col px-1 pt-4 md:w-5/12">
              <p className="w-fit self-center border-b-4 border-purple-700 text-center text-4xl">
                Simplify Volunteer Coordination
              </p>
              <p className="self-center border-purple-700 text-center text-xl">
                Interesting in joining as a nonprofit? Apply below!
              </p>
              {/*<hr className="mb-8 mt-4"></hr>*/}
              <div className="rounded-md bg-slate-50 py-12 shadow-sm">
                <div className="mx-auto w-11/12 lg:w-2/6">
                  <div className="flex h-1 items-center justify-between bg-gray-200">
                    <div className="flex h-1 w-1/2 items-center bg-indigo-700">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-700 text-white shadow">
                        1
                      </div>
                    </div>
                    {pages >= 2 && (
                      <div className="flex h-1 w-1/2 items-center self-center bg-indigo-700 text-white">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-700 shadow">
                          2
                        </div>
                      </div>
                    )}
                    {pages === 1 && (
                      <div className="flex h-1 w-1/2 items-center self-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                          2
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      {pages >= 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-700 text-white shadow">
                          3
                        </div>
                      )}
                      {pages <= 2 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                          3
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                    handleSubmit(values);
                    setSubmitting(false);
                    resetForm();
                  }}
                  validationSchema={createOrganizationValidator}
                >
                  {({ handleSubmit, isValid, isSubmitting, values }) => (
                    <div className="flex flex-col justify-center">
                      {pages === 4 && (
                        <div className="m-auto flex flex-col">
                          <div className="m-6 mt-8 flex flex-row self-center text-2xl font-bold text-purple-700">
                            Success!
                          </div>
                          Congrats your application was submitted successfully!
                          If you are accepted, someone from Bits of Good will
                          reach out shortly with setup information.
                        </div>
                      )}
                      {pages === 5 && (
                        <div className="m-auto flex flex-col">
                          <div className="m-6 mt-8 flex flex-row self-center text-2xl font-bold text-purple-700">
                            We experienced an error!
                          </div>
                          Uh oh! For some reason, your application submission
                          failed. Please refresh the screen to try again or
                          reach out to hello@bitsofgood.org
                        </div>
                      )}
                      <form>
                        {pages === 1 && (
                          <>
                            <div className="m-auto flex flex-col">
                              <div className="m-6 mt-8 flex flex-row self-center text-2xl font-bold text-purple-700">
                                Nonprofit Information
                              </div>
                            </div>

                            <div className="mx-10 flex flex-col self-stretch">
                              <InputField
                                name="name"
                                placeholder="Nonprofit name"
                                label="Nonprofit Name"
                              />
                              <InputField
                                name="website"
                                label="Nonprofit Website"
                                placeholder="https://www.example.com"
                              />
                              <div className="flex items-center justify-end">
                                <Button
                                  onClick={goNextPage}
                                  className="bg-purple-600 align-middle hover:bg-purple-700"
                                  size="sm"
                                  type="button"
                                >
                                  Next
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        {pages === 2 && (
                          <>
                            <div className="m-auto flex flex-col">
                              <div className="m-6 mt-8 flex flex-row self-center text-2xl font-bold text-purple-700">
                                Contact Information
                              </div>
                            </div>
                            <div className="mx-10 flex flex-col self-stretch">
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
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={goBackPage}
                                  className="mr-4 items-center text-purple-600 hover:text-purple-700 hover:underline"
                                  type="button"
                                >
                                  ← Back
                                </button>
                                <Button
                                  onClick={goNextPage}
                                  className="bg-purple-600 align-middle hover:bg-purple-700"
                                  size="sm"
                                  type="button"
                                >
                                  Next
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        {pages === 3 && (
                          <>
                            <div className="m-auto flex flex-col">
                              <div className="m-6 mt-8 flex flex-row self-center text-2xl font-bold text-purple-700">
                                Platform Information
                              </div>
                            </div>

                            <div className="mx-10 flex flex-col self-stretch">
                              <InputField
                                name="originalAdminEmail"
                                label="Primary Admin Account"
                                placeholder="example@email.com"
                                tooltip="This will be the main volunteer administrator email and cannot be changed"
                              />
                              <InputField
                                name="confirm_admin_email"
                                label="Confirm Primary Admin Account"
                                placeholder="example@email.com"
                              />
                              <Tooltip
                                className="flex flex-row"
                                content="Note: Your organization code must contain 3-20 letters or numbers"
                              >
                                <div className="flex flex-row self-center">
                                  <Label
                                    className="mb-1 flex h-6 items-center font-medium text-slate-600"
                                    htmlFor="slug"
                                  >
                                    Organization Code
                                    <InformationCircleIcon className="ml-1 flex w-4 text-black"></InformationCircleIcon>
                                  </Label>
                                </div>
                              </Tooltip>
                              <Field
                                className="flex justify-center"
                                name="slug"
                              >
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
                              <ErrorMessage
                                component="slug"
                                className="mt-1 inline-block pt-0 text-sm text-red-600"
                                name="slug"
                              />{" "}
                              <div className="mt-3 flex items-center justify-end">
                                <button
                                  onClick={goBackPage}
                                  className="mr-4 items-center text-purple-600 hover:text-purple-700 hover:underline"
                                  type="button"
                                >
                                  ← Back
                                </button>
                                <Button
                                  onClick={handleSubmit}
                                  className="self-stretch bg-purple-600 align-middle hover:bg-purple-700"
                                  size="sm"
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
              </div>
            </div>
            <div className="flex h-full flex-col self-stretch p-4 md:w-[33rem] md:p-0">
              <img
                src={"/images/admin-home-page.png"}
                className="h-full rounded-md shadow-lg"
                alt="admin home page"
              />
            </div>
          </div>
        </div>
      </div>
      {features.map((feature, index) => (
        <div
          key={index}
          className={
            "flex flex-col items-center [text-align:center] md:min-h-screen " + // workaround to prevent bootstrap conflict
            (index % 2 === 1
              ? "bg-white md:flex-row md:text-left"
              : "bg-purple-100 md:flex-row-reverse md:text-right")
          }
        >
          <div className="mt-20 flex-1 px-20 py-16 md:mt-0">
            <h1 className="mb-4 font-semibold text-purple-700">
              {feature.title}
            </h1>
            <p>{feature.description}</p>
          </div>
          <div className="m-16 flex flex-1 items-center justify-center">
            <img className="max-h-full max-w-full" src={feature.imageUrl} />
          </div>
        </div>
      ))}
      <AppFooter />
    </div>
  );
};

export default LandingPage;
