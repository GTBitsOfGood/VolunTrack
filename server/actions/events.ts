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
  try {
    if (!startDate && !endDate) {
      return await Event.aggregate([
        ...eventPopulator,
        { $match: { "eventParent.organizationId": organizationId } },
        { $sort: { date: 1 } },
      ]);
    } else if (!startDate) {
      return Event.aggregate([
        { $match: { $expr: { $lte: ["$date", endDate] } } },
        ...eventPopulator,
        { $match: { "eventParent.organizationId": organizationId } },
        { $sort: { date: 1 } },
      ]);
    } else if (!endDate) {
      return Event.aggregate([
        { $match: { $expr: { $gte: ["$date", startDate] } } },
        ...eventPopulator,
        { $match: { "eventParent.organizationId": organizationId } },
        { $sort: { date: 1 } },
      ]);
    } else {
      const test = Event.aggregate([
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
        { $sort: { date: 1 } },
      ]);
      return test;
    }
  } catch (err) {
    console.error("Aggregation failed:", err);
    throw err; // This will cause a 500 but with log context
  }
};
