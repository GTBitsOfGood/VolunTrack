import { Model, model, models, Schema, Types } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";

export type AttendanceData = {
  user: Types.ObjectId;
  event: Types.ObjectId;
  checkinTime?: Date;
  checkoutTime?: Date;
};

const attendanceSchema = new Schema<AttendanceData>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
  },
  { timestamps: true }
);
attendanceSchema.pre(documentMiddleware, async () => await dbConnect());
attendanceSchema.pre(queryMiddleware, async () => await dbConnect());
attendanceSchema.pre(documentOrQueryMiddleware, async () => await dbConnect());

export default ("Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
