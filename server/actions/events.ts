import { Types } from "mongoose";
import { scheduler } from "../jobs/scheduler";
import dbConnect from "../mongodb/index";
import Event, {
  EventData,
  EventDocument,
  EventPopulatedDocument,
} from "../mongodb/models/Event";
import {
  createHistoryEventCreateEvent,
  createHistoryEventEditEvent,
} from "./historyEvent";

export const getEvent = async (
  id: Types.ObjectId
): Promise<EventPopulatedDocument | undefined> => {
  await dbConnect();

  return await Event.findByIdPopulated(id);
};

export const getEvents = async (
  startDateString: string,
  endDateString: string,
  organizationId: Types.ObjectId
): Promise<EventPopulatedDocument[]> => {
  await dbConnect();

  const startDate =
    startDateString === "undefined" ? undefined : new Date(startDateString);
  const endDate =
    endDateString === "undefined" ? undefined : new Date(endDateString);

  if (!startDate && !endDate) {
    return Event.findPopulated(undefined, [
      { $match: { "eventParent.organizationId": organizationId } },
    ]);
  } else if (!startDate) {
    return Event.findPopulated(
      [{ $match: { $expr: { $lte: ["$date", endDate] } } }],
      [{ $match: { "eventParent.organizationId": organizationId } }]
    );
  } else if (!endDate) {
    return Event.findPopulated(
      [{ $match: { $expr: { $gte: ["$date", startDate] } } }],
      [{ $match: { "eventParent.organizationId": organizationId } }]
    );
  } else {
    return Event.findPopulated(
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
      ],
      [{ $match: { "eventParent.organizationId": organizationId } }]
    );
  }
};

export const createEvent = async (
  eventData: EventData
): Promise<EventDocument> => {
  await dbConnect();

  const event = new Event(eventData);
  console.log(event);

  await event.save();
  await scheduler.scheduleNewEventJobs(event);
  createHistoryEventCreateEvent(eventData);

  return event;
};

export const updateEvent = async (
  id: Types.ObjectId,
  eventData: EventData
): Promise<EventDocument | undefined> => {
  await dbConnect();

  const event = await Event.findByIdAndUpdate(id, eventData, {
    new: true,
  });
  if (!event) return undefined;
  createHistoryEventEditEvent(eventData);
  return event;
};

export const deleteEvent = async (
  id: Types.ObjectId
): Promise<Types.ObjectId | undefined> => {
  await dbConnect();

  const event = await Event.findByIdAndDelete(id);
  if (!event) return undefined;
  // createHistoryEventDeleteEvent()
  return id;
};

/**
 * Finds all Registrations that are on this event. Returns a list of all unique
 * users on those Registration documents
 *
 * @param id - Event id
 * @returns List of all users who are registered for the specified event
 */
// export const getEventVolunteers = async (
//   id: Types.ObjectId
// ): Promise<UserDocument[]> => {
//   await dbConnect();

//   const registrations = await Registration.find({ event: id })

//   registrations[0].
// };

// export async function getEventVolunteersList(eventId, next) {
//   await dbConnect();

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
