import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Dropdown, Sidebar, Toast } from "flowbite-react";
import { Field, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BoGButton from "../../components/BoGButton";
import InputField from "../../components/Forms/InputField";
import {
  getOrganization,
  updateOrganization,
} from "../../queries/organizations";
import { applyTheme } from "../../themes/themes";
import { createOrganizationValidator } from "./helpers";
import { organizationSettingsPages as pages } from "./pages";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import WaiverManager from "../Waivers/WaiverManager";

const OrganizationSettings = () => {
  const [organizationData, setOrganizationData] = useState({});
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [saved, setSaved] = useState(false);
  const user = useSession().data.user;

  const colors = {
    red: "text-red-800",
    orange: "text-orange-600",
    yellow: "text-yellow-500",
    green: "text-lime-500",
    sky: "text-sky-500",
    blue: "text-sky-800",
    purple: "text-purple-800",
    magenta: "text-pink-800",
  };

  const handleWindowClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
    return "Are you sure? You may have unsaved changes.";
  };

  const setTheme = (theme) => {
    applyTheme(theme);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getOrganization(user.organizationId);
      if (response.data.organization) {
        setOrganizationData(response.data.organization);
      }

      //window.addEventListener("beforeunload", handleWindowClose);
    }
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    await updateOrganization(user.organizationId, values);
  };

  return (
    <div>
      <Formik
        initialValues={{
          name: organizationData.name,
          website: organizationData.website,
          notificationEmail: organizationData.notificationEmail,
          imageUrl: organizationData.imageUrl,
          theme: organizationData.theme,

          defaultEventAddress: organizationData.defaultEventAddress,
          defaultEventCity: organizationData.defaultEventCity,
          defaultEventState: organizationData.defaultEventState,
          defaultEventZip: organizationData.defaultEventZip,
          defaultContactName: organizationData.defaultContactName,
          defaultContactEmail: organizationData.defaultContactEmail,
          defaultContactPhone: organizationData.defaultContactPhone,

          eventSilver: organizationData.eventSilver,
          eventGold: organizationData.eventGold,
          hoursSilver: organizationData.hoursSilver,
          hoursGold: organizationData.hoursGold,
        }}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleSubmit(values);
          setSaved(true);
          setSubmitting(false);
        }}
        validationSchema={createOrganizationValidator}
      >
        {({ handleSubmit, setFieldValue }) => (
          <div className="flex flex-col">
            <div className="container my-10 flex flex-wrap items-center justify-between">
              <div className="flex w-1/2 flex-col justify-center px-3 pt-2.5">
                <h3 className="text-4xl font-bold">Settings</h3>
              </div>
              <div className="flex w-1/2 flex-col items-end justify-center px-3">
                <BoGButton text="Save" onClick={handleSubmit} type="submit" />
              </div>
            </div>
            <div className="container flex flex-col flex-wrap items-center justify-between md:flex-row">
              <div className="flex flex-row justify-start">
                <Sidebar className="h-full">
                  <Sidebar.Items>
                    <Sidebar.ItemGroup className="!mt-0 !pt-0">
                      {pages.map((page, i) => (
                        <Sidebar.Item
                          className={
                            currentPage.key === page.key ? "bg-gray-200" : ""
                          }
                          icon={page.icon}
                          key={i}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page.title}
                        </Sidebar.Item>
                      ))}
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </Sidebar>

                <div className="flex-column flex min-w-[90%] p-4">
                  {saved && (
                    <div className="pb-3">
                      <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                          <CheckCircleIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                          Settings saved successfully!
                        </div>
                        <Toast.Toggle />
                      </Toast>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{currentPage.title}</h3>
                  {currentPage.key === "waiver" && (
                    <WaiverManager></WaiverManager>
                  )}
                  {currentPage.key !== "waiver" && (
                    <div className="w-full rounded-sm bg-grey p-4">
                      {currentPage.sections.map((section, i) => (
                        <div key={i} className="py-4">
                          <h3 key={i} className="mb-2 text-lg font-bold">
                            {section.title}
                          </h3>
                          <div className="flex flex-col gap-4 pr-0 md:flex-row">
                            {section.fields.map((field, j) =>
                              field.type === "dropdown" ? (
                                <Field name={field.name} key={j}>
                                  {({ field }) => (
                                    <Dropdown
                                      inline={true}
                                      arrowIcon={false}
                                      label={
                                        <BoGButton
                                          text="Set Theme"
                                          dropdown={true}
                                        />
                                      }
                                      id={field.name}
                                      name={field.name}
                                      key={j}
                                    >
                                      {Object.keys(colors).map((color) => (
                                        <Dropdown.Item
                                          key={color}
                                          onClick={() => {
                                            setTheme(color);
                                            setFieldValue("theme", color);
                                          }}
                                          className={
                                            "font-bold capitalize " +
                                            colors[color]
                                          }
                                        >
                                          {color}
                                        </Dropdown.Item>
                                      ))}
                                    </Dropdown>
                                  )}
                                </Field>
                              ) : (
                                <InputField
                                  type={field.type}
                                  key={field.name}
                                  name={field.name}
                                  label={field.label}
                                  placeholder={field.placeholder}
                                  isRequired={field.isRequired}
                                />
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AdminAuthWrapper(OrganizationSettings);
