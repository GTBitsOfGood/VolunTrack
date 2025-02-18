import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
import { EventParentData } from "../EventParent";
export * from "./validators";

const eventSchema = new Schema(
  {
    date: { type: Date, required: true },
    eventParent: {
      type: Schema.Types.ObjectId,
      ref: "EventParent",
      required: true,
    },
    isEnded: { type: Boolean, default: false },
  },
  { timestamps: true }
);
type EventData = InferSchemaType<typeof eventSchema>;
type EventPopulatedData = Omit<EventData, "eventParent"> & {
  eventParent: Omit<EventParentData, "createdAt" | "updatedAt">;
};

export type EventDocument = HydratedDocument<EventData>;
export type EventPopulatedDocument = HydratedDocument<EventPopulatedData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Event" in models
  ? (models.Event as Model<EventData>)
  : undefined) ?? model<EventData>("Event", eventSchema);
