import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { organizationSettingsPages as pages } from "./pages";
import styled from "styled-components";
import { Button, Sidebar, Dropdown } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { Field, Formik } from "formik";
import {
  getOrganizationData,
  updateOrganizationData,
} from "../../actions/queries";
import { applyTheme } from "../../themes/utils";
import { themes } from "../../themes/themes";

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

const OrganizationSettings = () => {
  const [organizationData, setOrganizationData] = useState({});
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const user = useSession().data.user;

  const handleWindowClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
    return "Are you sure? You may have unsaved changes.";
  };

  const setTheme = (theme) => {
    applyTheme(themes[theme]);
  };

  useEffect(async () => {
    const data = await getOrganizationData(user.organizationId);
    if (data) setOrganizationData(data);

    window.addEventListener("beforeunload", handleWindowClose);
  }, []);

  const handleSubmit = async (values) => {
    const data = {
      name: values.non_profit_name,
      website: values.non_profit_website,
      notificationEmail: values.notification_email,
      theme: values.theme,
      imageURL: values.logo_link,

      defaultEventAddress: values.default_address,
      defaultEventCity: values.default_city,
      defaultEventState: values.default_state,
      defaultEventZip: values.default_zip,
      defaultContactName: values.default_contact_name,
      defaultContactEmail: values.default_contact_email,
      defaultContactPhone: values.default_contact_phone,

      eventSilver: values.event_silver,
      eventGold: values.event_gold,
      hoursSilver: values.hours_silver,
      hoursGold: values.hours_gold,
    };

    await updateOrganizationData(user.organizationId, {
      data: data,
    });
  };

  return (
    <div>
      <Formik
        initialValues={{
          non_profit_name: organizationData.name,
          non_profit_website: organizationData.website,
          notification_email: organizationData.notificationEmail,
          logo_link: organizationData.imageURL,
          theme: organizationData.theme,

          default_address: organizationData.defaultAddress,
          default_city: organizationData.defaultCity,
          default_state: organizationData.defaultState,
          default_zip: organizationData.defaultZIP,
          default_contact_name: organizationData.defaultContactName,
          default_contact_email: organizationData.defaultContactEmail,
          default_contact_phone: organizationData.defaultContactPhone,

          event_silver: organizationData.eventSilver,
          event_gold: organizationData.eventGold,
          hours_silver: organizationData.hoursSilver,
          hours_gold: organizationData.hoursGold,
        }}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleSubmit(values);
          setSubmitting(false);
        }}
        validationSchema={createOrganizationValidator}
      >
        {({ handleSubmit }) => (
          <div>
            <div className="flex h-24 flex-row">
              <div className="flex w-1/2 flex-col justify-center px-10 pt-2.5">
                <h3 className="text-4xl font-bold">Settings</h3>
              </div>
              <div className="flex w-1/2 flex-col items-end justify-center px-7">
                <Button
                  className="w-48 bg-primaryColor hover:bg-hoverColor"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <Sidebar className="h-full">
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
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

              <div className="flex-column flex min-w-[50%] p-4">
                <h3 className="text-2xl font-bold">{currentPage.title}</h3>
                <p className="pb-3 text-slate-500">{currentPage.helperText}</p>
                <div className="rounded-sm bg-white p-4">
                  {currentPage.sections.map((section, i) => (
                    <div key={i} className="py-4">
                      <h3 key={i} className="mb-2 text-lg font-bold">
                        {section.title}
                      </h3>
                      <div className="flex gap-4">
                        {section.fields.map((field, j) =>
                          field.type === "dropdown" ? (
                            <Field name={field.name} key={j}>
                              {({ field }) => (
                                <Dropdown
                                  id={field.name}
                                  name={field.name}
                                  key={j}
                                  label="Set Theme"
                                  className="bg-primaryColor text-white"
                                >
                                  <Dropdown.Item
                                    onClick={() => setTheme("red")}
                                    className="font-bold text-red-800"
                                  >
                                    Red
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("orange")}
                                    className="font-bold text-orange-600"
                                  >
                                    Orange
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("yellow")}
                                    className="font-bold text-yellow-500"
                                  >
                                    Yellow
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("green")}
                                    className="font-bold text-lime-500"
                                  >
                                    Green
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("lightBlue")}
                                    className="font-bold text-sky-500"
                                  >
                                    Light Blue
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("blue")}
                                    className="font-bold text-blue-800"
                                  >
                                    Blue
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("purple")}
                                    className="font-bold text-purple-800"
                                  >
                                    Purple
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => setTheme("magenta")}
                                    className="font-bold text-pink-800"
                                  >
                                    Magenta
                                  </Dropdown.Item>
                                </Dropdown>
                              )}
                            </Field>
                          ) : (
                            <InputField
                              key={j}
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
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default authWrapper(OrganizationSettings);
