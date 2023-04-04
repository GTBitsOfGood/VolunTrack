import { model, Model, models, Schema, Types } from "mongoose";

export type HistoryEventData = {
  keyword: string;
  description: string;
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  eventId?: Types.ObjectId;
};

const historyEventSchema = new Schema<HistoryEventData>(
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
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

export default ("HistoryEvent" in models
  ? (models.HistoryEvent as Model<HistoryEventData>)
  : undefined) ?? model<HistoryEventData>("HistoryEvent", historyEventSchema);
