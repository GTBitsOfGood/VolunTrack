import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const eventParentInputClientValidator = (minMaxVolunteers?: number) =>
  z.object({
    title: z.string(),
    startTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "startTime must be in format HH:MM"
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        "endTime must be in format HH:MM"
      ),
    localTime: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z
      .string()
      .regex(/^[A-Z]{2}$/, "state must be a two-letter abbreviation"),
    zip: z.string().regex(/^[0-9]{5}$/, "zip must be a five-digit number"),
    eventContactPhone: z.string(),
    eventContactEmail: z.string().email(),
    maxVolunteers: z
      .number()
      .int()
      .gt(minMaxVolunteers ?? 0),
    isPrivate: z.boolean().optional(),
    isValidForCourtHours: z.boolean().optional(),
    sendReminderEmail: z.boolean().optional(),
    requiresApproval: z.boolean().optional(),
    isNotifyAdmin: z.boolean().optional(),
    organizationId: z.string(),
    // refine() is not working for some reason
    // .refine(
    //   (id) => isValidObjectId(id),
    //   (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
    // ),
    pocName: z.string().optional(),
    pocEmail: z
      .string()
      //.email("pocEmail must be a valid email address")
      .optional(),
    pocPhone: z.string().optional(),
    orgName: z.string().optional(),
    orgAddress: z.string().optional(),
    orgCity: z.string().optional(),
    orgState: z
      .string()
      // .regex(/^[A-Z]{2}$/, "orgState must be a two-letter abbreviation")
      .optional(),
    orgZip: z
      .string()
      //.regex(/^[0-9]{5}$/, "orgZip must be a five-digit number")
      .optional(),
    description: z.string().optional(),
    tasks: z.array(z.string().optional()),
  });

export const eventParentInputServerValidator = z.object({
  title: z.string(),
  startTime: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "startTime must be in format HH:MM"
    ),
  endTime: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "endTime must be in format HH:MM"
    ),
  localTime: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z
    .string()
    .regex(/^[A-Z]{2}$/, "state must be a two-letter abbreviation"),
  zip: z.string().regex(/^[0-9]{5}$/, "zip must be a five-digit number"),
  eventContactPhone: z.string(),
  eventContactEmail: z.string().email(),
  maxVolunteers: z.number().int().positive(),
  isPrivate: z.boolean().optional(),
  isValidForCourtHours: z.boolean().optional(),
  isNotifyAdmin: z.boolean().optional(),
  sendReminderEmail: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  organizationId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
  ),
  pocName: z.string().optional(),
  pocEmail: z
    .string()
    //.email("pocEmail must be a valid email address")
    .optional(),
  pocPhone: z.string().optional(),
  orgName: z.string().optional(),
  orgAddress: z.string().optional(),
  orgCity: z.string().optional(),
  orgState: z
    .string()
    //.regex(/^[A-Z]{2}$/, "orgState must be a two-letter abbreviation")
    .optional(),
  orgZip: z
    .string()
    //.regex(/^[0-9]{5}$/, "orgZip must be a five-digit number")
    .optional(),
  description: z.string().optional(),
  tasks: z.array(z.string().optional()),
});

export type EventParentInputClient = z.infer<
  ReturnType<typeof eventParentInputClientValidator>
>;
export type EventParentInputServer = z.infer<
  typeof eventParentInputServerValidator
>;
