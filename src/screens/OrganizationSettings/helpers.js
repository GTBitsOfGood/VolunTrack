import { string, object, number } from "yup";

export const createOrganizationValidator = object().shape({
  name: string().trim().required("Organization name is required"),
  website: string().nullable().trim().url("Invalid URL"),
  notificationEmail: string().nullable().trim().email("Invalid email"),
  imageUrl: string().nullable().trim().url("Invalid URL"),
  theme: string().nullable().trim(),

  defaultEventAddress: string().nullable().trim(),
  defaultEventCity: string().nullable().trim(),
  defaultEventState: string().nullable().trim(),
  defaultEventZip: string()
    .nullable()
    .trim()
    .matches(/^[0-9]+$/, "Must be a number"),

  defaultContactName: string().nullable().trim(),
  defaultContactEmail: string().nullable().trim().email("Invalid email"),
  defaultContactPhone: string().nullable().trim(),

  eventSilver: number(),
  eventGold: number(),
  hoursSilver: number(),
  hoursGold: number(),
});
