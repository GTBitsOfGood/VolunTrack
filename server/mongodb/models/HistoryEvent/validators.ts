import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const historyEventInputClientValidator = z.object({
  keyword: z.string(),
  description: z.string().optional(),
  userId: z.instanceof(Types.ObjectId),
  organizationId: z.instanceof(Types.ObjectId),
  eventId: z.instanceof(Types.ObjectId).optional(),
});

export const historyEventInputServerValidator = z.object({
  keyword: z.string(),
  description: z.string().optional(),
  userId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({
      message: `userId ${id} is not a valid ObjectId`,
    })
  ),
  organizationId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({
      message: `organizationId ${id} is not a valid ObjectId`,
    })
  ),
  eventId: z
    .string()
    .refine(
      (id) => isValidObjectId(id),
      (id) => ({
        message: `eventId ${id} is not a valid ObjectId`,
      })
    )
    .optional(),
});

export type HistoryEventInputClient = z.infer<
  typeof historyEventInputClientValidator
>;
export type HistoryEventInputServer = z.infer<
  typeof historyEventInputServerValidator
>;
