import { z } from "zod";

export const registrationInputValidator = z.object({
  eventId: z.string(),
  userId: z.string(),
  minors: z.array(z.string()).optional(),
});
export type RegistrationInputData = z.infer<typeof registrationInputValidator>;
