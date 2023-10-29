import { string, object, ref } from "yup";

export const createOrganizationValidator = object().shape({
  name: string().trim().required("Organization name is required"),
  website: string().trim().required("Organization website is required"),
  defaultContactName: string().trim().required("Contact name is required"),
  defaultContactEmail: string()
    .trim()
    .required("Contact email is required")
    .email("Invalid email"),
  defaultContactPhone: string().trim().required("Contact Phone is required"),
  originalAdminEmail: string()
    .trim()
    .required("Admin Email is required")
    .email("Invalid email"),
  confirm_admin_email: string().oneOf(
    [ref("originalAdminEmail"), null],
    "Emails must match"
  ),
  slug: string()
    .trim()
    .required("Organization code is required")
    .matches(/^[a-zA-Z0-9_.-]*$/, "Must be only letters or numbers")
    .min(3, "Must be between 3 and 20 letters or numbers")
    .max(20, "Must be between 3 and 20 letters or numbers"),
});
