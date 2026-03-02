import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";

const volunteerLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    inTime: { type: Date, required: true },
    outTime: { type: Date, required: true },
  },
  { timestamps: true }
);

type VolunteerLogData = InferSchemaType<typeof volunteerLogSchema>;

export type VolunteerLogDocument = HydratedDocument<VolunteerLogData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "VolunteerLog" in models
  ? (models.VolunteerLog as Model<VolunteerLogData>)
  : undefined) ??
  model<VolunteerLogData>("VolunteerLog", volunteerLogSchema);

