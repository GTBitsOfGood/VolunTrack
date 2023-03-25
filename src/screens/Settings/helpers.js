import { string, object, ref } from "yup";

export const createOrganizationValidator = object().shape({
  non_profit_name: string().trim().required("Organization name is required"),
  non_profit_website: string().trim().url("Invalid URL"),
  notification_email: string().trim().email("Invalid email"),
  logo_link: string().trim().url("Invalid URL"),
  default_address: string().trim(),
  default_city: string().trim(),
  default_state: string().trim(),
  default_zip: string()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
  default_contact_name: string().trim(),
  default_contact_email: string().trim().email("Invalid email"),
  default_contact_phone: string().trim(),

  event_silver: string()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
  event_gold: string()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
  hours_silver: string()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
  hours_gold: string()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
});
