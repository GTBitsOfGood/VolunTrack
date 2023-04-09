import { Types } from "mongoose";
import { z } from "zod";

export const historyEventInputValidator = z.object({
  keyword: z.string(),
  description: z.string(),
  userId: z.instanceof(Types.ObjectId),
  organizationId: z.instanceof(Types.ObjectId),
  eventId: z.instanceof(Types.ObjectId).optional(),
});
export type HistoryEventInputData = z.infer<typeof historyEventInputValidator>;
