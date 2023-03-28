import { Model, model, models, Schema, Types } from "mongoose";

export type AttendanceData = {
  event: Types.ObjectId;
  user: Types.ObjectId;
  timeCheckedIn: Date;
  timeCheckedOut?: Date;
};

const attendanceSchema = new Schema<AttendanceData>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timeCheckedIn: { type: Date, required: true },
    timeCheckedOut: Date,
  },
  { timestamps: true }
);

export default ("Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
