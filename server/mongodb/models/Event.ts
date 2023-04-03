import { Model, model, models, Schema, Types } from "mongoose";

export type EventData = {
  date: Date;
  eventParentId: Types.ObjectId;
  isEnded: boolean;
};

export type EventPopulatedData = {
  date: Date;
  eventParent: EventParentData;
  isEnded: boolean;
};

const eventSchema = new Schema<EventData>(
  {
    date: { type: Date, required: true },
    eventParentId: {
      type: Schema.Types.ObjectId,
      ref: "EventParent",
    },
    isEnded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default ("Event" in models
  ? (models.Event as Model<EventData>)
  : undefined) ?? model<EventData>("Event", eventSchema);
