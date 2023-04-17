import { Types } from "mongoose";

export type QueryPartialMatch = {
  organizationId?: Types.ObjectId;
  eventId?: Types.ObjectId;
  userId?: Types.ObjectId;
};
