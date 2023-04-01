import { model, Model, models, Schema, Types } from "mongoose";
import { z } from "zod";

export const waiverValidator = z.object({
  organizationId: z.instanceof(Types.ObjectId),
  type: z.enum(["adult", "minor"]).optional(),
  text: z.string().optional(),
});

export type WaiverData = z.infer<typeof waiverValidator>;

const waiverSchema = new Schema<WaiverData>(
  {
    organizationId: {
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

export default ("Waiver" in models
  ? (models.Waiver as Model<WaiverData>)
  : undefined) ?? model<WaiverData>("Waiver", waiverSchema);
