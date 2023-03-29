import { Model, model, models, Schema, Types } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";

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
registrationSchema.pre(documentMiddleware, async () => await dbConnect());
registrationSchema.pre(queryMiddleware, async () => await dbConnect());
registrationSchema.pre(
  documentOrQueryMiddleware,
  async () => await dbConnect()
);

export default ("Registration" in models
  ? (models.Registration as Model<RegistrationData>)
  : undefined) ?? model<RegistrationData>("Registration", registrationSchema);
