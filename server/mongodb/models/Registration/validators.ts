import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const registrationInputClientValidator = z.object({
  organizationId: z.instanceof(Types.ObjectId),
  eventId: z.instanceof(Types.ObjectId),
  userId: z.instanceof(Types.ObjectId),
  minors: z.array(z.string()).optional(),
  approved: z.enum(["pending", "approved", "denied"]).optional(),
  tasks: z.array(z.string()).optional(),
});

export const registrationInputServerValidator = z.object({
  organizationId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({
      message: `organizationId ${id} is not a valid ObjectId`,
    })
  ),
  eventId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({
      message: `eventId ${id} is not a valid ObjectId`,
    })
  ),
  userId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({
      message: `userId ${id} is not a valid ObjectId`,
    })
  ),
  minors: z.array(z.string()).optional(),
  approved: z.enum(["pending", "approved", "denied"]).optional(),
  tasks: z.array(z.string()).optional(),
});

export type RegistrationInputClient = z.infer<
  typeof registrationInputClientValidator
>;
export type RegistrationInputServer = z.infer<
  typeof registrationInputServerValidator
>;
