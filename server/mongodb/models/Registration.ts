import { Model, model, models, Schema, Types } from "mongoose";

export type RegistrationData = {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  minors: string[];
};

const registrationSchema = new Schema<RegistrationData>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    minors: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default ("Registration" in models
  ? (models.Registration as Model<RegistrationData>)
  : undefined) ?? model<RegistrationData>("Registration", registrationSchema);
