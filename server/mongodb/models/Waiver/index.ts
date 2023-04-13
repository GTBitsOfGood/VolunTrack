import {
  HydratedDocument,
  InferSchemaType,
  model,
  Model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const waiverSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    type: { type: String, enum: ["adult", "minor"], default: "adult" },
    text: String,
  },
  { timestamps: true }
);
type WaiverData = InferSchemaType<typeof waiverSchema>;

export type WaiverDocument = HydratedDocument<WaiverData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Waiver" in models
  ? (models.Waiver as Model<WaiverData>)
  : undefined) ?? model<WaiverData>("Waiver", waiverSchema);
