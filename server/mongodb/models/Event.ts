import { Model, model, models, Schema, Types } from "mongoose";
import { z } from "zod";
import { eventParentValidator } from "./EventParent";

export const eventValidator = z.object({
  date: z.date(),
  eventParentId: z.instanceof(Types.ObjectId),
  isEnded: z.boolean().optional(),
});

export const eventPopulatedValidator = z.object({
  date: z.date(),
  eventParent: eventParentValidator,
  isEnded: z.boolean().optional(),
});

export type EventData = z.infer<typeof eventValidator>;

export type EventPopulatedData = z.infer<typeof eventPopulatedValidator>;

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
