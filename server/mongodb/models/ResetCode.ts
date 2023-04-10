import { Model, model, models, Schema, Types } from "mongoose";
const mongoose = require("mongoose");

export type ResetCodeData = {
  userId: Types.ObjectId;
  code: string;
  email: string;
  createdAt: Date;
};

const resetcodeSchema = new Schema<ResetCodeData>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default ("ResetCode" in models
  ? (models.ResetCode as Model<ResetCodeData>)
  : undefined) ?? model<ResetCodeData>("ResetCode", resetcodeSchema);

mongoose.connection
  .collection("ResetCode")
  .createIndex({ createdAt: 1 }, { expireAfterSeconds: 900 });
