import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const waiverInputClientValidator = z.object({
  organizationId: z.instanceof(Types.ObjectId),
  type: z.enum(["adult", "minor"]).optional(),
  text: z.string().optional(),
});

export const waiverInputServerValidator = z.object({
  organizationId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
  ),
  type: z.enum(["adult", "minor"]).optional(),
  text: z.string().optional(),
});

export type WaiverInputClient = z.infer<typeof waiverInputClientValidator>;
export type WaiverInputServer = z.infer<typeof waiverInputServerValidator>;
