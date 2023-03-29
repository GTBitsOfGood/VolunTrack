import { model, Model, models, Schema, Types } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";

export type WaiverData = {
  organization: Types.ObjectId;
  type?: "adult" | "minor";
  text?: string;
};

const waiverSchema = new Schema<WaiverData>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
    type: { type: String, enum: ["adult", "minor"], default: "adult" },
    text: String,
  },
  { timestamps: true }
);
waiverSchema.pre(documentMiddleware, async () => await dbConnect());
waiverSchema.pre(queryMiddleware, async () => await dbConnect());
waiverSchema.pre(documentOrQueryMiddleware, async () => await dbConnect());

export default ("Waiver" in models
  ? (models.Waiver as Model<WaiverData>)
  : undefined) ?? model<WaiverData>("Waiver", waiverSchema);
