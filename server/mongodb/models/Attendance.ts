import { Model, model, models, Schema, Types } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";

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
attendanceSchema.pre(documentMiddleware, async () => await dbConnect());
attendanceSchema.pre(queryMiddleware, async () => await dbConnect());
attendanceSchema.pre(documentOrQueryMiddleware, async () => await dbConnect());

export default ("Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
