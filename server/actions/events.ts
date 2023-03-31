import { HydratedDocument, Types } from "mongoose";
import { eventPopulator } from "../mongodb/aggregations";
import Event, { EventPopulatedData } from "../mongodb/models/Event";

export const getEvents = async (
  startDateString: string,
  endDateString: string,
  organizationId: Types.ObjectId
): Promise<HydratedDocument<EventPopulatedData>[]> => {
  const startDate =
    startDateString === "undefined" ? undefined : new Date(startDateString);
  const endDate =
    endDateString === "undefined" ? undefined : new Date(endDateString);

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
