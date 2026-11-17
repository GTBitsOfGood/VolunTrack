import { Types } from "mongoose";
import dbConnect from "../mongodb";
import Event, { EventPopulatedDocument } from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";

type EventRow = {
  _id: Types.ObjectId;
  date: Date;
  eventParent: Types.ObjectId;
  [field: string]: unknown;
};

const unique = (ids: Types.ObjectId[]) =>
  [...new Set(ids.map(String))].map((id) => new Types.ObjectId(id));

/**
 * An organization's shifts (optionally between two dates), each with its full
 * event parent and recurringEvents (how many later shifts share the series).
 *
 * This used to be one aggregation that joined every shift in the database to
 * every other shift of its series ($lookup) before keeping one organization's.
 * On the live site's database (Azure Cosmos DB, where only _id is indexed) that
 * was the slow part of the Events page and its week box. Plain lookups by _id
 * and in-memory joins give the same records.
 */
export const getEvents = async (
  organizationId: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
): Promise<EventPopulatedDocument[]> => {
  await dbConnect();
  try {
    const ranged = !!(startDate || endDate);
    let events: EventRow[];
    let parents: { _id: Types.ObjectId }[];
    if (ranged) {
      events = await Event.find({
        date: {
          ...(startDate ? { $gte: startDate } : {}),
          ...(endDate ? { $lte: endDate } : {}),
        },
      }).lean<EventRow[]>();
      const parentIds = unique(events.map((e) => e.eventParent));
      parents = parentIds.length
        ? await EventParent.find({
            _id: { $in: parentIds },
            organizationId,
          }).lean()
        : [];
    } else {
      parents = await EventParent.find({ organizationId }).lean();
      events = parents.length
        ? await Event.find({
            eventParent: { $in: parents.map((p) => p._id) },
          }).lean<EventRow[]>()
        : [];
    }

    const parentById = new Map(parents.map((p) => [String(p._id), p]));
    const mine = events.filter((e) => parentById.has(String(e.eventParent)));

    // Later shifts of each series are counted over the whole series, also
    // outside the dates asked for (as the old $lookup did).
    const seriesShifts =
      ranged && mine.length
        ? await Event.find(
            { eventParent: { $in: unique(mine.map((e) => e.eventParent)) } },
            { eventParent: 1, date: 1 }
          ).lean<EventRow[]>()
        : mine;
    const datesBySeries = new Map<string, number[]>();
    for (const shift of seriesShifts) {
      const key = String(shift.eventParent);
      const list = datesBySeries.get(key) ?? [];
      list.push(new Date(shift.date).getTime());
      datesBySeries.set(key, list);
    }

    return mine
      .map((e) => {
        const time = new Date(e.date).getTime();
        return {
          ...e,
          eventParent: parentById.get(String(e.eventParent)),
          recurringEvents: (
            datesBySeries.get(String(e.eventParent)) ?? []
          ).filter((t) => t > time).length,
        };
      })
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime() ||
          String(a._id).localeCompare(String(b._id))
      ) as unknown as EventPopulatedDocument[];
  } catch (err) {
    console.error("Loading events failed:", err);
    throw err; // This will cause a 500 but with log context
  }
};
