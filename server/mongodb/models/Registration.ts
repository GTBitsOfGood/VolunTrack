import { Model, model, models, Schema, Types } from "mongoose";

export type RegistrationData = {
  minors: string[];
  event: Types.ObjectId;
  user: Types.ObjectId;
};

const registrationSchema = new Schema<RegistrationData>(
  {
    minors: { type: [String], required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default ("Registration" in models
  ? (models.Registration as Model<RegistrationData>)
  : undefined) ?? model<RegistrationData>("Registration", registrationSchema);
