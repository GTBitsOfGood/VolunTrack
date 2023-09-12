import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const attendanceInputClientValidator = z.object({
  userId: z.instanceof(Types.ObjectId),
  eventId: z.instanceof(Types.ObjectId),
  organizationId: z.instanceof(Types.ObjectId),
  checkinTime: z.date().optional(),
  checkoutTime: z.date().optional(),
  eventName: z.string().optional(),
  volunteerName: z.string().optional(),
  volunteerEmail: z.string().optional(),
});

export const attendanceInputServerValidator = z.object({
  userId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `userId ${id} is not a valid ObjectId` })
  ),
  eventId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `eventId ${id} is not a valid ObjectId` })
  ),
  organizationId: z.string().refine(
    (id) => isValidObjectId(id),
    (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
  ),
  eventName: z.string().optional(),
  volunteerName: z.string().optional(),
  volunteerEmail: z.string().optional(),
  checkinTime: z.string().datetime().optional(),
  checkoutTime: z.string().datetime().optional(),
});

export type AttendanceInputClient = z.infer<
  typeof attendanceInputClientValidator
>;
export type AttendanceInputServer = z.infer<
  typeof attendanceInputServerValidator
>;
