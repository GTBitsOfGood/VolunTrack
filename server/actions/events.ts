import { HydratedDocument, Types } from "mongoose";
import { scheduler } from "../jobs/scheduler";
import { eventPopulator } from "../mongodb/aggregations";
import Event, {
  EventData,
  EventPopulatedData
} from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import Registration from "../mongodb/models/Registration";
import User from "../mongodb/models/User";
import {
  createHistoryEventCreateEvent,
  createHistoryEventEditEvent
} from "./historyEvent";

export const getEvent = async (
  id: Types.ObjectId
): Promise<HydratedDocument<EventPopulatedData> | undefined> => {
  

  const events = await Event.aggregate([ ...eventPopulator, { $match: { _id: id } } ]);
  if (events.length === 0) return undefined;
  return events[0];
};

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
    return Event.aggregate([ ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  } else if (!startDate) {
    return Event.aggregate([
      { $match: { $expr: { $lte: ["$date", endDate] } } },
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } }
    ]);
  } else if (!endDate) {
    return Event.aggregate([
      { $match: { $expr: { $gte: ["$date", startDate] } } },
      ...eventPopulator,
      { $match: { "eventParent.organizationId": organizationId } }
    ]);
  } else {
    return Event.aggregate(
      [
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
      { $match: { "eventParent.organizationId": organizationId } }]
    );
  }
};

export const createEvent = async (
  eventData: EventData
): Promise<EventData> => {
  

  const event = new Event(eventData);
  await event.save();

  await scheduler.scheduleNewEventJobs(event);
  createHistoryEventCreateEvent(eventData);

  return event;
};

export const createEventWithParent = async (
  eventData: EventPopulatedData
): Promise<EventPopulatedDocument> => {
  

  const eventParent = await EventParent.create(eventData.eventParent);
  const event = await Event.create({ ...eventData, eventParent:  })

  return (await Event.findByIdPopulated(event._id))!;
};

export const updateEvent = async (
  id: Types.ObjectId,
  eventData: EventData
): Promise<EventDocument | undefined> => {
  

  const event = await Event.findByIdAndUpdate(id, eventData, {
    new: true,
  });
  if (!event) return undefined;
  createHistoryEventEditEvent(eventData);
  return event;
};

/**
 * Finds all Registrations that are on this event. Returns a list of all unique
 * users on those Registration documents
 *
 * @param id - Event id
 * @returns List of all users who are registered for the specified event
 */
export const getEventVolunteers = async (
  id: Types.ObjectId
): Promise<UserDocument[]> => {
  

  const registrations = await Registration.find({ event: id });
  const userIds = new Set(registrations.map((r) => r.user));
  const users = await User.find({ id: { $in: userIds } });

  return users;
};

// export async function getEventVolunteersList(eventId, next) {
//   

//   let result = {
//     volunteer: [],
//     minor: {},
//   };
//   let volunteers = [];
//   let minors = [];
//   await Event.find({ _id: eventId })
//     .then((event) => {
//       volunteers = event[0].volunteers;
//       volunteers = volunteers.map(mongoose.Types.ObjectId);
//       minors = event[0].minors;
//     })
//     .catch(next);
//   await User.find({ _id: { $in: volunteers } })
//     .then((users) => {
//       for (const user of users) {
//         const name = user.bio.first_name + " " + user.bio.last_name;
//         result.volunteer.push(name);
//       }
//     })
//     .catch(next);
//   for (const minor of minors) {
//     await User.findOne({ _id: ObjectId(minor.volunteer_id) })
//       .then((user) => {
//         const name = user.bio.first_name + " " + user.bio.last_name;
//         result.minor[name] = minor.minor;
//       })
//       .catch(next);
//   }
//   return result;
// }