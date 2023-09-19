import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";

const resetCodeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { timestamps: true }
);

resetCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 }); // 15 mins

type ResetCodeData = InferSchemaType<typeof resetCodeSchema>;

export type ResetCodeDocument = HydratedDocument<ResetCodeData>;

export default ("ResetCode" in models
  ? (models.ResetCode as Model<ResetCodeData>)
  : undefined) ?? model<ResetCodeData>("ResetCode", resetCodeSchema);
