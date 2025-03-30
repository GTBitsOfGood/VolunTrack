import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";
import {
  eventParentInputClientValidator,
  eventParentInputServerValidator,
} from "../EventParent/validators";

export const eventInputClientValidator = z.object({
  date: z.coerce.date(),
  eventParentId: z.instanceof(Types.ObjectId),
  isEnded: z.boolean().optional(),
});

export const eventPopulatedInputClientValidator = (minMaxVolunteers?: number) =>
  z.object({
    date: z.coerce.date(),
    eventParent: eventParentInputClientValidator(minMaxVolunteers),
    isEnded: z.boolean().optional(),
    recurringEvent: z.string(),
    customRecurrenceSettings: z
      .object({
        recurrenceChoice: z.string(),
        recurrenceNumber: z.number().int().positive(),
        recurrenceDays: z.array(z.string()),
        recurrenceEndType: z.string(),
        recurrenceEndDate: z.coerce.date().optional(),
        recurrenceEndOccurences: z.number().int().positive().optional(),
      })
      .optional(),
  });

export const eventInputServerValidator = z.object({
  date: z.coerce.date(),
  eventParentId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `eventParentId ${id} is not a valid ObjectId` })
  ),
  isEnded: z.boolean().optional(),
});

export const eventPopulatedInputServerValidator = z.object({
  date: z.coerce.date(),
  eventParent: eventParentInputServerValidator,
  isEnded: z.boolean().optional(),
  recurringEvent: z.string(),
  customRecurrenceSettings: z
    .object({
      recurrenceChoice: z.string(),
      recurrenceNumber: z.number().int().positive(),
      recurrenceDays: z.array(z.string()),
      recurrenceEndType: z.string(),
      recurrenceEndDate: z.coerce.date().optional(),
      recurrenceEndOccurences: z.number().int().positive().optional(),
    })
    .or(z.null()),
});

export type EventInputClient = z.infer<typeof eventInputClientValidator>;
export type EventPopulatedInputClient = z.infer<
  ReturnType<typeof eventPopulatedInputClientValidator>
>;
export type EventInputServer = z.infer<typeof eventInputServerValidator>;
export type EventPopulatedInputServer = z.infer<
  typeof eventPopulatedInputServerValidator
>;
