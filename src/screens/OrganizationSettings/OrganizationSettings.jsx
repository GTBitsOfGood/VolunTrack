import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { organizationSettingsPages as pages } from "./pages";
import { Sidebar, Dropdown } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { Field, Formik } from "formik";
import {
  getOrganizationData,
  updateOrganizationData,
} from "../../actions/queries";
import { applyTheme } from "../../themes/themes";
import BoGButton from "../../components/BoGButton";

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

  const colors = {
    red: "text-red-800",
    orange: "text-orange-600",
    yellow: "text-yellow-500",
    green: "text-lime-500",
    "light blue": "text-sky-500",
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
      const response = await getOrganizationData(user.organizationId);
      if (response.data.orgData) {
        setOrganizationData(response.data.orgData);
      }

      // window.addEventListener("beforeunload", handleWindowClose);
    }
    fetchData();
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

          default_address: organizationData.defaultEventAddress,
          default_city: organizationData.defaultEventCity,
          default_state: organizationData.defaultEventState,
          default_zip: organizationData.defaultEventZip,
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
        {({ handleSubmit, setFieldValue }) => (
          <div>
            <div className="flex h-24 flex-row">
              <div className="flex w-1/2 flex-col justify-center px-10 pt-2.5">
                <h3 className="text-4xl font-bold">Settings</h3>
              </div>
              <div className="flex w-1/2 flex-col items-end justify-center px-7">
                <BoGButton text="Save" onClick={handleSubmit} type="submit" />
              </div>
            </div>
            <div className="flex">
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
                                        "font-bold capitalize " + colors[color]
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
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default authWrapper(OrganizationSettings);