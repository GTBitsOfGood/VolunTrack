import { model, Model, models, Schema, Types } from "mongoose";

export type HistoryEventData = {
  keyword: string;
  description: string;
  user: Types.ObjectId;
  event?: Types.ObjectId;
  organization?: Types.ObjectId;
};

const historyEventSchema = new Schema<HistoryEventData>(
  {
    keyword: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: "63d6dcc4e1fb5fd6e69b1738",
    },
  },
  { timestamps: true }
);

export default ("HistoryEvent" in models
  ? (models.HistoryEvent as Model<HistoryEventData>)
  : undefined) ?? model<HistoryEventData>("HistoryEvent", historyEventSchema);
