import {
  Document,
  model,
  Model,
  models,
  PipelineStage,
  Schema,
  Types,
} from "mongoose";
import { z } from "zod";
import { registrationPopulation } from "../aggregations";
import { EventData } from "./Event";

export const registrationValidator = z.object({
  minors: z.string().array(),
  event: z.instanceof(Types.ObjectId),
  user: z.instanceof(Types.ObjectId),
});

export interface RegistrationData
  extends z.infer<typeof registrationValidator> {}
export interface RegistrationDocument extends RegistrationData, Document {}
export interface RegistrationPopulatedDocument
  extends Omit<RegistrationData, "event" | "user">,
    Document {
  event: EventData;
  user: UserData;
}

// TODO: replace all findByIdPopulated and findPopulated functions with generic interfaces and impl
interface RegistrationModel extends Model<RegistrationDocument> {
  findByIdPopulated(
    id: Types.ObjectId
  ): Promise<RegistrationPopulatedDocument | undefined>;
  findPopulated(
    prePopulatedStages?: PipelineStage[],
    postPopulatedStages?: PipelineStage[]
  ): Promise<RegistrationPopulatedDocument[]>;
}

const registrationSchema = new Schema<RegistrationDocument, RegistrationModel>(
  {
    minors: { type: [String], required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

registrationSchema.statics.findByIdPopulated = async function (
  id: Types.ObjectId
): Promise<RegistrationPopulatedDocument | undefined> {
  const events = await this.aggregate<RegistrationPopulatedDocument>([
    { $match: { _id: id } },
    ...registrationPopulation,
  ]);
  return events.length > 0 ? events[0] : undefined;
};

registrationSchema.statics.findPopulated = async function (
  prePopulateStages?: PipelineStage[],
  postPopulateStages?: PipelineStage[]
): Promise<RegistrationPopulatedDocument[]> {
  return this.aggregate<RegistrationPopulatedDocument>([
    ...(prePopulateStages ?? []),
    ...registrationPopulation,
    ...(postPopulateStages ?? []),
  ]);
};

export default ("Registration" in models
  ? (models.Registration as RegistrationModel)
  : undefined) ??
  model<RegistrationDocument, RegistrationModel>(
    "Registration",
    registrationSchema
  );
