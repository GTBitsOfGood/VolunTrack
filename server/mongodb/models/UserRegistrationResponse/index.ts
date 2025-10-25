import {
  HydratedDocument,
  InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";
export * from "./validators";
const questionResponseSchema = new Schema(
    {
        questionId: { type: String, required: true },
        value: { type: String, required: true },
        questionType: { type: String,
             enum: ["multiple", "dropdown", "response", "checkboxes"],
             required: true
        } // Assumption based off what the implementation will probably require?
    }
);
const userRegistrationResponseSchema = new Schema(
    {
        email: { type: String, required: true },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        responses: {
            type: [questionResponseSchema],
            required: true,
            default: [],
        }
    }
);

type ResponseData = InferSchemaType<typeof userRegistrationResponseSchema>;

export type ResponseDocument = HydratedDocument<ResponseData>;

// Need to disable in order to check that "models" is defined
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export default (models && "Response" in models
  ? (models.Response as Model<ResponseData>)
  : undefined) ?? model<ResponseData>("Response", userRegistrationResponseSchema);
