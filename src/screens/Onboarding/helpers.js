import { string, object, ref } from "yup";

export const createOrganizationValidator = object().shape({
    organization_name: string().trim().required("Organization name is required"),
    website_url: string().trim().required("Website URL is required").url("Invalid URL"),
    contact_name: string().trim().required("Contact name is required"),
    contact_email: string().trim().required("Contact email is required").email("Invalid email"),
    contact_phone: string().trim().required("Contact Phone is required"),
    admin_email: string().trim().required("Admin Email is required").email("Invalid email"),
    confirm_admin_email: string().oneOf(
        [ref("admin_email"), null],
        "Emails must match"
    ),
    organization_code: string().trim().required("Organization code is required"),
})