import { z } from "zod";

export const historyEventInputValidator = z.object({
  keyword: z.string(),
  description: z.string(),
  userId: z.string(),
  organizationId: z.string(),
  eventId: z.string().optional(),
});
export type HistoryEventInputData = z.infer<typeof historyEventInputValidator>;
