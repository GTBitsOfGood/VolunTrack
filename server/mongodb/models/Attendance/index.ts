import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      default: "Event",
    },
    volunteerName: {
      type: String,
      required: true,
      default: "Volunteer",
    },
    volunteerEmail: {
      type: String,
      required: true,
      default: "volunteer@gmail.com",
    },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
    minutes: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
type AttendanceData = Omit<
  InferSchemaType<typeof attendanceSchema>,
  "checkinTime" | "checkoutTime"
> & { checkinTime: Date | null; checkoutTime: Date | null };

export type AttendanceDocument = HydratedDocument<AttendanceData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Attendance" in models
  ? (models.Attendance as Model<AttendanceData>)
  : undefined) ?? model<AttendanceData>("Attendance", attendanceSchema);
