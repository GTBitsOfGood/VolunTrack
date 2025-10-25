import { z } from "zod";

export const questionItemClientValidator = z.object({
  id: z.string().uuid("Item ID must be a valid UUID"),
  value: z.string().min(1, "Option value cannot be empty"),
});

export const registrationQuestionClientValidator = z
  .object({
    id: z.string().uuid("Question ID must be a valid UUID"),
    title: z.string().min(1, "Question title cannot be empty").default("Question"),
    type: z.enum(["multiple", "dropdown", "response", "checkboxes"]),
    items: z.array(questionItemClientValidator).default([]),
    text: z.string().optional(),
  })
  .refine(
    (data) => {
      const requiresItems = ["multiple", "dropdown", "checkboxes"].includes(data.type);
      if (requiresItems && data.items.length === 0) {
        // Non-free response question types require items list
        return false;
      }
      if (data.type === "response" && data.items.length > 0) {
        // Free response shouldn't have items list
        return false;
      }
      return true;
    },
    {
      message: "Question structure is inconsistent with its type.",
      path: ["items"],
    }
  );

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
  requiresUserApproval: z.boolean(),
  userRegistrationForm: z
    .array(registrationQuestionClientValidator)
    .optional()
    .default([]),
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
  requiresUserApproval: z.boolean(),
  userRegistrationForm: z
    .array(registrationQuestionClientValidator)
    .optional()
    .default([]),
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
