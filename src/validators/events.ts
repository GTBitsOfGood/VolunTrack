import { isValidObjectId } from "mongoose";
import { z } from "zod";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const eventInputValidator = z.object({
  date: z.coerce.date().min(yesterday, "Date cannot be in the past"),
  eventParentId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `EventParentId ${id} is not a valid ObjectId` })
  ),
  isEnded: z.boolean().optional(),
});
export type EventInputData = z.infer<typeof eventInputValidator>;

export const eventPopulatedInputValidator = z.object({
  date: z.coerce.date().min(yesterday, "Date cannot be in the past"),
  eventParent: z
    .object({
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      localTime: z.string().optional(),
      address: z.string(),
      city: z.string(),
      state: z.string().regex(/^[A-Z]{2}$/),
      zip: z.string().regex(/^\d{5}$/),
      eventContactPhone: z.string(),
      eventContactEmail: z.string().email(),
      maxVolunteers: z.number().min(1),
      isPrivate: z.boolean().optional(),
      isValidForCourtHours: z.boolean().optional(),
      organizationId: z.string().length(24),
      // Checking isValidObjectId(organizationId) through refine doesn't work with zod-formik-adapter for some reason, maybe they'll fix it?
      // .refine(
      //   (id) => isValidObjectId(id),
      //   "OrganizationId is not a valid ObjectId"
      // ),
      pocName: z.string().optional(),
      pocEmail: z.string().email().optional().or(z.literal("")),
      pocPhone: z.string().optional(),
      orgName: z.string().optional(),
      orgAddress: z.string().optional(),
      orgCity: z.string().optional(),
      orgState: z
        .string()
        .regex(/^[A-Z]{2}$/)
        .optional()
        .or(z.literal("")),
      orgZip: z
        .string()
        .regex(/^\d{5}$/)
        .optional()
        .or(z.literal("")),
      description: z.string().optional(),
    })
    .refine(
      (eventParent) => eventParent.startTime < eventParent.endTime,
      (eventParent) => ({
        message: `EventParent startTime ${eventParent.startTime} must be before endTime ${eventParent.endTime}`,
        path: ["startTime", "endTime"],
      })
    ),
  isEnded: z.boolean().optional(),
});
export type EventPopulatedInputData = z.infer<
  typeof eventPopulatedInputValidator
>;
