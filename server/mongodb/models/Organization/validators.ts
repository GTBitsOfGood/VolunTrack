import { z } from "zod";

export const organizationInputClientValidator = z.object({
  name: z.string(),
  website: z.string().url("website must be a valid URL"),
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  notificationEmail: z
    .string()
    .email("notificationEmail must be a valid email"),
  slug: z.string(),
  theme: z.string().optional(),
  defaultEventState: z
    .string()
    .regex(/^[A-Z]{2}$/, "defaultEventState must be a two-letter abbreviation"),
  defaultEventCity: z.string(),
  defaultEventAddress: z.string(),
  defaultEventZip: z
    .string()
    .regex(/^[0-9]{5}$/, "defaultEventZip must be a five-digit number"),
  defaultContactName: z.string(),
  defaultContactEmail: z
    .string()
    .email("defaultContactEmail must be a valid email"),
  defaultContactPhone: z.string(),
  invitedAdmins: z
    .array(z.string().email("invitedAdmins must be valid emails"))
    .optional(),
  originalAdminEmail: z
    .string()
    .email("originalAdminEmail must be a valid email"),
  active: z.boolean().optional(),
  eventSilver: z.number().int().positive().optional(),
  eventGold: z.number().int().positive().optional(),
  hoursSilver: z.number().int().positive().optional(),
  hoursGold: z.number().int().positive().optional(),
  homePage: z.string(),
  aboutPageToggle: z.boolean().optional(),
});

export const organizationInputServerValidator = z.object({
  name: z.string(),
  website: z.string().url("website must be a valid URL"),
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  notificationEmail: z
    .string()
    .email("notificationEmail must be a valid email"),
  slug: z.string(),
  theme: z.string().optional(),
  defaultEventState: z
    .string()
    .regex(/^[A-Z]{2}$/, "defaultEventState must be a two-letter abbreviation"),
  defaultEventCity: z.string(),
  defaultEventAddress: z.string(),
  defaultEventZip: z
    .string()
    .regex(/^[0-9]{5}$/, "defaultEventZip must be a five-digit number"),
  defaultContactName: z.string(),
  defaultContactEmail: z
    .string()
    .email("defaultContactEmail must be a valid email"),
  defaultContactPhone: z.string(),
  invitedAdmins: z
    .array(z.string().email("invitedAdmins must be valid emails"))
    .optional(),
  originalAdminEmail: z
    .string()
    .email("originalAdminEmail must be a valid email"),
  active: z.boolean().optional(),
  eventSilver: z.number().int().positive().optional(),
  eventGold: z.number().int().positive().optional(),
  hoursSilver: z.number().int().positive().optional(),
  hoursGold: z.number().int().positive().optional(),
  homePage: z.string(),
  aboutPageToggle: z.boolean().optional(),
});

export const organizationInputCreationValidator = z.object({
  name: z.string(),
  website: z.string().url("website must be a valid URL"),
  slug: z.string(),
  originalAdminEmail: z.string().email("Admin Email must be a valid email"),
  defaultContactName: z.string(),
  defaultContactEmail: z
    .string()
    .email("defaultContactEmail must be a valid email"),
  defaultContactPhone: z.string(),
  notificationEmail: z.string().optional(),
  invitedAdmins: z.array(z.string()).optional(),
});

export type OrganizationInputClient = z.infer<
  typeof organizationInputClientValidator
>;
export type OrganizationInputServer = z.infer<
  typeof organizationInputServerValidator
>;
