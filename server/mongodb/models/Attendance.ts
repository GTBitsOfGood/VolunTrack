import { Model, model, models, Schema, Types } from "mongoose";

export type AttendanceData = {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  checkinTime?: Date;
  checkoutTime?: Date;
};

const attendanceSchema = new Schema<AttendanceData>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
