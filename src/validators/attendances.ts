import { z } from "zod";

export const attendanceInputValidator = z.object({
  userId: z.string(),
  eventId: z.string(),
  checkinTime: z.date().optional(),
  checkoutTime: z.date().optional(),
});
export type AttendanceInputData = z.infer<typeof attendanceInputValidator>;
