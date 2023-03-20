import { scheduler } from "../jobs/scheduler";
import dbConnect from "../mongodb/index";
import Event, { EventType } from "../mongodb/models/Event";
import {
  createHistoryEventCreateEvent,
  createHistoryEventEditEvent
} from "./historyEvent";
const User = require("../mongodb/models/user");
const mongoose = require("mongoose");
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

  if (!startDate && !endDate) {
    return Event.find().populate("parentEventId").sort({ date: "asc" });
  } else if (!startDate) {
    return Event.find({ date: { $lte: endDate } })
      .populate("parentEventId")
      .sort({ date: "asc" });
  } else if (!endDate) {
    return Event.find({ date: { $gte: startDate } })
      .populate("parentEventId")
      .sort({ date: "asc" });
  } else {
    return Event.find({ date: { $gte: startDate, $lte: endDate } })
      .populate("parentEventId")
      .sort({
        date: "asc",
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
