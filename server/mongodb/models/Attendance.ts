import {
  Document,
  model,
  Model,
  models,
  PipelineStage,
  Schema,
  Types,
} from "mongoose";
import { z } from "zod";
import { attendancePopulation } from "../aggregations";
import { EventData } from "./Event";

export const attendanceValidator = z.object({
  timeCheckedIn: z.date(),
  timeCheckedOut: z.date(),
  event: z.instanceof(Types.ObjectId),
  user: z.instanceof(Types.ObjectId),
});

export interface AttendanceData extends z.infer<typeof attendanceValidator> {}
export interface AttendanceDocument extends AttendanceData, Document {}
export interface AttendancePopulatedDocument
  extends Omit<AttendanceData, "event" | "user">,
    Document {
  event: EventData;
  user: UserData;
}

// TODO: replace all findByIdPopulated and findPopulated functions with generic interfaces and impl
interface AttendanceModel extends Model<AttendanceDocument> {
  findByIdPopulated(
    id: Types.ObjectId
  ): Promise<AttendancePopulatedDocument | undefined>;
  findPopulated(
    prePopulatedStages?: PipelineStage[],
    postPopulatedStages?: PipelineStage[]
  ): Promise<AttendancePopulatedDocument[]>;
}

const attendanceSchema = new Schema<AttendanceDocument, AttendanceModel>(
  {
    timeCheckedIn: { type: Date, required: true },
    timeCheckedOut: { type: Date, required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

attendanceSchema.statics.findByIdPopulated = async function (
  id: Types.ObjectId
): Promise<AttendancePopulatedDocument | undefined> {
  const events = await this.aggregate<AttendancePopulatedDocument>([
    { $match: { _id: id } },
    ...attendancePopulation,
  ]);
  return events.length > 0 ? events[0] : undefined;
};

attendanceSchema.statics.findPopulated = async function (
  prePopulateStages?: PipelineStage[],
  postPopulateStages?: PipelineStage[]
): Promise<AttendancePopulatedDocument[]> {
  return this.aggregate<AttendancePopulatedDocument>([
    ...(prePopulateStages ?? []),
    ...attendancePopulation,
    ...(postPopulateStages ?? []),
  ]);
};

export default ("Attendance" in models
  ? (models.Attendance as AttendanceModel)
  : undefined) ??
  model<AttendanceDocument, AttendanceModel>("Attendance", attendanceSchema);
