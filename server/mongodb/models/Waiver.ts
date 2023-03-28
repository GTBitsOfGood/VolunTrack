import { model, Model, models, Schema, Types } from "mongoose";

export type WaiverData = {
  type: string;
  organization: Types.ObjectId;
  text?: string;
};

const waiverSchema = new Schema<WaiverData>(
  {
    type: { type: String, required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
    text: String,
  },
  { timestamps: true }
);

export default ("Waiver" in models
  ? (models.Waiver as Model<WaiverData>)
  : undefined) ?? model<WaiverData>("Waiver", waiverSchema);
