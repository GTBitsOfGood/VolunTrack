import { Types } from "mongoose";
import { scheduler } from "../jobs/scheduler";
import dbConnect from "../mongodb/index";
import Event, { EventType } from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import {
  createHistoryEventCreateEvent,
  createHistoryEventEditEvent,
} from "./historyEvent";
const User = require("../mongodb/models/user");
const ObjectId = require("mongodb").ObjectId;

export async function createEvent(newEventData, next) {
  const newEvent = new Event(newEventData);

  await dbConnect();

  return newEvent
    .save()
    .then(async (event) => {
      await scheduler.scheduleNewEventJobs(event);
      createHistoryEventCreateEvent(newEventData);
    })
    .catch(next);
}

export const getEvents = async (
  startDateString: string,
  endDateString: string,
  organizationId: string
): Promise<EventType[]> => {
  await dbConnect();

  const startDate =
    startDateString === "undefined" ? undefined : new Date(startDateString);
  const endDate =
    endDateString === "undefined" ? undefined : new Date(endDateString);

  const eventAggregation = Event.aggregate([
    {
      $lookup: {
        from: EventParent.collection.name,
        let: { eventParent: "$eventParent" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$eventParent"],
              },
            },
          },
        ],
        as: "eventParent",
      },
    },
    {
      $unwind: "$eventParent",
    },
    {
      $match: {
        "eventParent.organizationId": Types.ObjectId(organizationId),
      },
    },
    {
      $project: {
        "eventParent._id": 0,
        "eventParent.__v": 0,
        "eventParent.createdAt": 0,
        "eventParent.updatedAt": 0,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$eventParent"],
        },
      },
    },
    {
      $project: { eventParent: 0 },
    },
  ]);

  if (!startDate && !endDate) {
    return await eventAggregation;
  } else if (!startDate) {
    return await eventAggregation.match({
      $expr: { $lte: ["$date", endDate] },
    });
  } else if (!endDate) {
    return await eventAggregation.match({
      $expr: { $gte: ["$date", startDate] },
    });
  } else {
    return await eventAggregation.match({
      $expr: {
        $and: [{ $gte: ["$date", startDate] }, { $lte: ["$date", endDate] }],
      },
    });
  }
};

export async function updateEvent(updateEventData, next) {
  await dbConnect();

  return Event.findOneAndUpdate({ _id: updateEventData._id }, updateEventData, {
    new: true,
  })
    .then((event) => {
      createHistoryEventEditEvent(updateEventData);
      return event;
    })
    .catch((err) => {
      next(err);
    });
}

export async function deleteEventID(eventID, next) {
  await dbConnect();

  return Event.findByIdAndDelete({ _id: eventID })
    .then(() => {
      return;
    })
    .catch(next);
}

export async function updateEventID(eventID, event, next) {
  await dbConnect();

  return Event.findByIdAndUpdate(eventID, event, {
    new: true,
    useFindAndModify: false,
  })
    .then(() => {
      return event;
    })
    .catch(next);
}

export async function getEventVolunteersList(eventId, next) {
  await dbConnect();

  let result = {
    volunteer: [],
    minor: {},
  };
  let volunteers = [];
  let minors = [];
  await Event.find({ _id: eventId })
    .then((event) => {
      volunteers = event[0].volunteers;
      volunteers = volunteers.map(mongoose.Types.ObjectId);
      minors = event[0].minors;
    })
    .catch(next);
  await User.find({ _id: { $in: volunteers } })
    .then((users) => {
      for (const user of users) {
        const name = user.bio.first_name + " " + user.bio.last_name;
        result.volunteer.push(name);
      }
    })
    .catch(next);
  for (const minor of minors) {
    await User.findOne({ _id: ObjectId(minor.volunteer_id) })
      .then((user) => {
        const name = user.bio.first_name + " " + user.bio.last_name;
        result.minor[name] = minor.minor;
      })
      .catch(next);
  }
  return result;
}

export async function getEventByID(eventID) {
  await dbConnect();

  return Event.findById(eventID).then((event) => {
    return event;
  });
}
