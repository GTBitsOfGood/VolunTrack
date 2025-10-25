import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const questionResponseClientValidator = z.object({
    questionId: z.string(),
    value: z.string(),
    questionType: z.enum(["multiple", "dropdown", "response", "checkboxes"]),
});

export const userRegistrationInputClientValidator = z.object({
    email: z.string(),
    organizationId: z
    .string()
    .refine(
      (id) => isValidObjectId(id),
      (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
    ),
    responses: z.array(questionResponseClientValidator).default([]),
});

export const userRegistrationInputServerValidator = z.object({
    email: z.string(),
    organizationId: z
    .string()
    .refine(
      (id) => isValidObjectId(id),
      (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
    ),
    responses: z.array(questionResponseClientValidator).default([]),
});

export type RegistrationInputClient = z.infer<typeof userRegistrationInputClientValidator>;
export type RegistrationInputServer = z.infer<typeof userRegistrationInputServerValidator>;
