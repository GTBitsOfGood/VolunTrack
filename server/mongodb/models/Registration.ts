import { Model, model, models, Schema, Types } from "mongoose";
import { z } from "zod";

export const registrationValidator = z.object({
  eventId: z.instanceof(Types.ObjectId),
  userId: z.instanceof(Types.ObjectId),
  minors: z.string().array().optional(),
});

export type RegistrationData = z.infer<typeof registrationValidator>;

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
