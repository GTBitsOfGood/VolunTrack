import { Document, Model, model, models, Schema } from "mongoose";
import { EventParentType } from "./EventParent";

export interface EventType extends Document {
  date: Date;
  isEnded: boolean;
  eventParent: Schema.Types.ObjectId | EventParentType;
}

const eventSchema = new Schema<EventType>(
  {
    date: { type: Date, required: true },
    isEnded: { type: Boolean, required: true },
    eventParent: { type: Schema.Types.ObjectId, ref: "EventParent" },
  },
  { timestamps: true }
);

export default (models.Event as Model<EventType, {}, {}>) ??
  model<EventType>("Event", eventSchema, "events_copy");
