import { Model, model, models, Schema, Types } from "mongoose";
import { z } from "zod";

export const attendanceValidator = z.object({
  userId: z.instanceof(Types.ObjectId),
  eventId: z.instanceof(Types.ObjectId),
  checkinTime: z.date().optional(),
  checkoutTime: z.date().optional(),
});

export type AttendanceData = z.infer<typeof attendanceValidator>;

const attendanceSchema = new Schema<AttendanceData>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
  },
  { timestamps: true }
);

export default (models && "Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
