import { model, Model, models, Schema, Types } from "mongoose";

export type WaiverData = {
  organizationId: Types.ObjectId;
  type: "adult" | "minor";
  text?: string;
};

const waiverSchema = new Schema<WaiverData>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
    type: { type: String, enum: ["adult", "minor"], default: "adult" },
    text: String,
  },
  { timestamps: true }
);

export default ("Waiver" in models
  ? (models.Waiver as Model<WaiverData>)
  : undefined) ?? model<WaiverData>("Waiver", waiverSchema);
