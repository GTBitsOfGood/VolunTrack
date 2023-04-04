import { z } from "zod";

export const waiverInputValidator = z.object({
  organizationId: z.string(),
  type: z.enum(["adult", "minor"]).optional(),
  text: z.string().optional(),
});
export type WaiverInputData = z.infer<typeof waiverInputValidator>;
