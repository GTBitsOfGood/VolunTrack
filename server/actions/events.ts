import { Types } from "mongoose";
import dbConnect from "../mongodb";
import { eventPopulator } from "../mongodb/aggregations";
import Event, { EventPopulatedDocument } from "../mongodb/models/Event";

export const getEvents = async (
  organizationId: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
): Promise<EventPopulatedDocument[]> => {
  await dbConnect();

  if (!startDate && !endDate) {
    return Event.aggregate([
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  } else if (!startDate) {
    return Event.aggregate([
      { $match: { $expr: { $lte: ["$date", endDate] } } },
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  } else if (!endDate) {
    return Event.aggregate([
      { $match: { $expr: { $gte: ["$date", startDate] } } },
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  } else {
    return Event.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $gte: ["$date", startDate] },
              { $lte: ["$date", endDate] },
            ],
          },
        },
      },
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  }
};
