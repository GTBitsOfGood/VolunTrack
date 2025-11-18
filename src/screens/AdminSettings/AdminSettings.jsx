import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Dropdown, Sidebar, Toast, ToggleSwitch } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import BoGButton from "../../components/BoGButton";
import InputField from "../../components/Forms/InputField";
import { adminSettingsPages as pages } from "./pages";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";

const AdminSettings = () => {
  const [adminData, setAdminData] = useState({
    // Notification preferences
    emailAlerts: true,
    emailEventRegistrations: true,
    emailEventCancellations: true,
    dashboardAlerts: true,
    dashboardEventReminders: true,
    smsAlerts: false,
    smsUrgentAlerts: false,

    // Volunteer approval
    enableWorkflow: false,
    autoApproveVolunteers: true,
    requireBackgroundCheck: false,
    defaultMessage: "Thank you for your interest in volunteering!",
    rejectionMessage: "Thank you for your interest, but we cannot approve your application at this time.",

    // Default values
    defaultCap: 20,
    defaultShift: 4,
    defaultEventDuration: 8,
    requireWaiver: true,
    autoSendReminders: true,

    // User management
    allowAdminSelfRemoval: false,
    requireAdminApproval: true,
    passwordExpirationDays: 90,
    requireStrongPasswords: true,
    logUserActivity: true,
    logRetentionDays: 365,

    // System config
    timezone: "America/New_York",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    customLogo: "",
    primaryColor: "#6b21a8",
    customFavicon: "",
  });

  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [saved, setSaved] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  // Debug logging
  console.log("AdminSettings - User:", user);
  console.log("AdminSettings - Pages:", pages);
  console.log("AdminSettings - Current Page:", currentPage);

  const handleSave = async (values) => {
    try {
      // TODO: Implement API call to save admin settings
      console.log("Saving admin settings:", values);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving admin settings:", error);
    }
  };

  const renderField = (field, sectionTitle) => {
    if (field.type === "toggle") {
      return (
        <div key={field.name} className="flex items-center justify-between py-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-900">
              {field.label}
            </label>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
          <Field name={field.name}>
            {({ field: formikField, form }) => (
              <ToggleSwitch
                checked={formikField.value}
                onChange={(checked) => form.setFieldValue(field.name, checked)}
                color="primary"
              />
            )}
          </Field>
        </div>
      );
    }

    if (field.type === "dropdown") {
      return (
        <div key={field.name} className="py-2">
          <label className="text-sm font-medium text-gray-900">
            {field.label}
          </label>
          <Field name={field.name}>
            {({ field: formikField, form }) => (
              <Dropdown
                arrowIcon={false}
                style={{ backgroundColor: "white" }}
                label={
                  <div className="flex items-center gap-2">
                    <span style={{ color: "black" }}>
                      {formikField.value || "Select option"}
                    </span>
                  </div>
                }
              >
                <Dropdown.Item onClick={() => form.setFieldValue(field.name, "enabled")}>
                  Enabled
                </Dropdown.Item>
                <Dropdown.Item onClick={() => form.setFieldValue(field.name, "disabled")}>
                  Disabled
                </Dropdown.Item>
              </Dropdown>
            )}
          </Field>
        </div>
      );
    }

    // Default to InputField for other types
    return (
      <InputField
        key={field.name}
        type={field.type || "text"}
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        isRequired={field.isRequired}
        className={`px-3 py-1 rounded-full border ${
                selectedLocation === loc ? "bg-primaryColor text-white" : "bg-white text-gray-900"
              }`}
      />
    );
  };

  // Safety check
  if (!user) {
    return <div>Loading...</div>;
  }

  if (!pages || pages.length === 0) {
    return <div>No settings pages found</div>;
  }

  if (!currentPage) {
    return <div>No current page selected</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {pages.map((page) => (
              <Sidebar.Item
                key={page.key}
                icon={page.icon}
                active={currentPage.key === page.key}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer"
              >
                {page.title}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{currentPage.title}</h1>
          {currentPage.helperText && (
            <p className="text-gray-600">{currentPage.helperText}</p>
          )}
        </div>

        <Formik
          initialValues={adminData}
          onSubmit={handleSave}
          enableReinitialize
        >
          {({ values, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {currentPage.sections && currentPage.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="rounded-lg bg-white p-6 shadow-sm border"
                  >
                    <h3 className="mb-4 text-lg font-semibold">
                      {section.title}
                    </h3>
                    <div className="space-y-4">
                      {section.fields && section.fields.map((field) =>
                        renderField(field, section.title)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <BoGButton
                  type="submit"
                  className="bg-primaryColor hover:bg-hoverColor"
                >
                  Save Changes
                </BoGButton>
              </div>
            </form>
          )}
        </Formik>

        {/* Success Toast */}
        {saved && (
          <Toast className="fixed bottom-4 right-4">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <div className="ml-3 text-sm font-normal">
              Settings saved successfully!
            </div>
          </Toast>
        )}
      </div>
    </div>
  );
};

export default AdminAuthWrapper(AdminSettings);