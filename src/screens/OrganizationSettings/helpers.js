import { string, object } from "yup";

export const createOrganizationValidator = object().shape({
  non_profit_name: string().trim().required("Organization name is required"),
  non_profit_website: string().nullable().trim().url("Invalid URL"),
  notification_email: string().nullable().trim().email("Invalid email"),
  logo_link: string().nullable().trim().url("Invalid URL"),
  default_address: string().nullable().trim(),
  default_city: string().nullable().trim(),
  default_state: string().nullable().trim(),
  default_zip: string()
    .nullable()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),
  default_contact_name: string().nullable().trim(),
  default_contact_email: string().nullable().trim().email("Invalid email"),
  default_contact_phone: string().nullable().trim(),

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
