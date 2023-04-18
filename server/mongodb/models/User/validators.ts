import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

export const userInputClientValidator = z.object({
  email: z.string().email(),
  organizationId: z.instanceof(Types.ObjectId),
  role: z.enum(["admin", "volunteer", "manager"]),
  status: z.enum(["has_volunteered", "new"]),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  zip: z.string().optional(), //.regex(/^[0-9]{5}$/, "zip must be a five-digit number"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z
    .string()
    // .regex(/^[A-Z]{2}$/, "state must be a two-letter abbreviation")
    .optional(),
  notes: z.string().optional(),
  passwordHash: z.string().optional(),
  imageUrl: z.string().optional(),
  isBitsOfGoodAdmin: z.boolean().optional(),
});

export const userInputServerValidator = z.object({
  email: z.string().email(),
  organizationId: z
    .string()
    .refine(
      (id) => isValidObjectId(id),
      (id) => ({ message: `organizationId ${id} is not a valid ObjectId` })
    )
    .optional(),
  role: z.enum(["admin", "volunteer", "manager"]).optional(),
  status: z.enum(["has_volunteered", "new"]).optional(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  zip: z
    .string()
    // .regex(/^[0-9]{5}$/, "zip must be a five-digit number")
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z
    .string()
    // .regex(/^[A-Z]{2}$/, "state must be a two-letter abbreviation")
    .optional(),
  notes: z.string().nullable().optional(),
  passwordHash: z.string().optional(),
  password: z.string().optional(),
  imageUrl: z.string().optional(),
  isBitsOfGoodAdmin: z.boolean().optional(),
});

export type UserInputClient = z.infer<typeof userInputClientValidator>;
export type UserInputServer = z.infer<typeof userInputServerValidator>;
