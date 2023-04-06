import { z } from "zod";

export const userInputValidator = z.object({
  email: z.string().email(),
  organizationId: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  zip: z
    .string()
    // .regex(/^\d{5}$/)
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z
    .string()
    // .regex(/^[A-Z]{2}$/)
    .optional(),
  notes: z.string().optional(),
  passwordHash: z.string().optional(),
  imageUrl: z.string().optional(),
  isBitsOfGoodAdmin: z.boolean().optional(),
  password: z.string().optional(),
  adminId: z.string().optional(),
});
export type UserInputData = z.infer<typeof userInputValidator>;
