import {
  HydratedDocument,
  InferSchemaType,
  model,
  Model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";

const historyEventSchema = new Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);
type HistoryEventData = InferSchemaType<typeof historyEventSchema>;

export type HistoryEventDocument = HydratedDocument<HistoryEventData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "HistoryEvent" in models
  ? (models.HistoryEvent as Model<HistoryEventData>)
  : undefined) ?? model<HistoryEventData>("HistoryEvent", historyEventSchema);
