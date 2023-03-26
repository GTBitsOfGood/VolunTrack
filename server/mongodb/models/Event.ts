import {
  Document,
  Model,
  model,
  models,
  PipelineStage,
  Schema,
  Types,
} from "mongoose";
import { z } from "zod";
import { eventPopulation } from "../aggregations";
import { EventParentData } from "./EventParent";

export const eventValidator = z.object({
  date: z.date(),
  isEnded: z.boolean(),
  eventParent: z.instanceof(Types.ObjectId),
});

export interface EventData extends z.infer<typeof eventValidator> {}
export interface EventDocument extends EventData, Document {}
export interface EventPopulatedDocument
  extends Omit<EventData, "eventParent">,
    Document {
  eventParent: EventParentData;
}

interface EventModel extends Model<EventDocument> {
  /**
   * Finds a single event with the eventParent field populated
   *
   * @param id - Event id
   * @returns The selected event or undefined if event with id is not found
   */
  findByIdPopulated(
    id: Types.ObjectId
  ): Promise<EventPopulatedDocument | undefined>;

  /**
   * Finds all events resulting from the given pipeline stages, with the
   * eventParent field populated. NOTE: Only the $match stage has been tested,
   * all other pipeline stages could result in a return type other than
   * EventPopulatedDocument[].
   *
   * @param prePopulatedStages - Pipeline stages that run before the population
   *   of eventParent, i.e. $match on fields belonging to EventData like $date
   * @param postPopulatedStages - Pipelines stages that run after the population
   *   of eventParent, i.e. $match on fields belonging to EventParentData like
   *   "eventParent.organizationId"
   */
  findPopulated(
    prePopulatedStages?: PipelineStage[],
    postPopulatedStages?: PipelineStage[]
  ): Promise<EventPopulatedDocument[]>;
}

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    date: { type: Date, required: true },
    isEnded: { type: Boolean, required: true },
    eventParent: {
      type: Schema.Types.ObjectId,
      ref: "EventParent",
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.statics.findByIdPopulated = async function (
  id: Types.ObjectId
): Promise<EventPopulatedDocument | undefined> {
  const events = await this.aggregate<EventPopulatedDocument>([
    { $match: { _id: id } },
    ...eventPopulation,
  ]);
  return events.length > 0 ? events[0] : undefined;
};

eventSchema.statics.findPopulated = async function (
  prePopulateStages?: PipelineStage[],
  postPopulateStages?: PipelineStage[]
): Promise<EventPopulatedDocument[]> {
  return this.aggregate<EventPopulatedDocument>([
    ...(prePopulateStages ?? []),
    ...eventPopulation,
    ...(postPopulateStages ?? []),
  ]);
};

export default ("Event" in models ? (models.Event as EventModel) : undefined) ??
  model<EventDocument, EventModel>("Event", eventSchema, "events_copy");
