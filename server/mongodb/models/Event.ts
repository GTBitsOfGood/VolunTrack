import { Model, model, models, Schema, Types } from "mongoose";
import dbConnect from "../";
import {
  documentMiddleware,
  documentOrQueryMiddleware,
  queryMiddleware,
} from "../middleware";
import { EventParentData } from "./EventParent";
export type EventData = {
  date: Date;
  eventParent: Types.ObjectId;
  isEnded?: boolean;
};
export type EventPopulatedData = {
  date: Date;
  eventParent: EventParentData;
  isEnded?: boolean;
};

const eventSchema = new Schema<EventData>(
  {
    date: { type: Date, required: true },
    eventParent: {
      type: Schema.Types.ObjectId,
      ref: "EventParent",
    },
    isEnded: { type: Boolean, default: false, optional: true },
  },
  { timestamps: true }
);
eventSchema.pre(documentMiddleware, async () => await dbConnect());
eventSchema.pre(queryMiddleware, async () => await dbConnect());
eventSchema.pre(documentOrQueryMiddleware, async () => await dbConnect());

export default ("Event" in models
  ? (models.Event as Model<EventData>)
  : undefined) ?? model<EventData>("Event", eventSchema, "events_copy");
