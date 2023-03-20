import { Document, Model, model, models, Schema } from "mongoose";

export interface EventType extends Document {
  date: Date;
  isEnded: boolean;
  parentEventId: Schema.Types.ObjectId;
}

const eventSchema = new Schema<EventType>(
  {
    date: { type: Date, required: true },
    isEnded: { type: Boolean, required: true },
    parentEventId: { type: Schema.Types.ObjectId, ref: "ParentEvent" },
  },
  { timestamps: true }
);

export default (models.Event as Model<EventType, {}, {}>) ||
  model<EventType>("Event", eventSchema);
