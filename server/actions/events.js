const EventData = require("../mongodb/models/event");
import dbConnect from "../mongodb/index";

export async function createEvent(newEventData, next) {
  const newEvent = new EventData(newEventData);

  await dbConnect();

  return newEvent
    .save()
    .then(() => {
      return;
    })
    .catch((err) => {
      next(err);
    });
}

export async function getEvents(startDate, endDate, next) {
  await dbConnect();

  if (startDate == "undefined" && endDate == "undefined") {
    return EventData.find({})
      .then((events) => {
        return events;
      })
      .catch(next);
  } else if (startDate == "undefined") {
    endDate = new Date(endDate);
    if (endDate == "Invalid Date") {
      return { status: 400, message: { error: "Invalid Date sent" } };
    } else {
      return EventData.find({ date: { $lte: endDate } })
        .then((events) => {
          return events;
        })
        .catch(next);
    }
  } else if (endDate == "undefined") {
    startDate = new Date(startDate);
    if (startDate == "Invalid Date") {
      return { status: 400, message: { error: "Invalid Date sent" } };
    } else {
      return EventData.find({ date: { $gte: startDate } })
        .then((events) => {
          return events;
        })
        .catch(next);
    }
  } else {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (startDate == "Invalid Date" || endDate == "Invalid Date") {
      return { status: 400, message: { error: "Invalid Date sent" } };
    } else {
      return EventData.find({ date: { $gte: startDate, $lte: endDate } })
        .then((events) => {
          return events;
        })
        .catch(next);
    }
  }
}

export async function updateEvent(updateEventData, next) {
  await dbConnect();

  console.log(updateEventData);
  return EventData.findOneAndUpdate(
    { _id: updateEventData._id },
    updateEventData,
    {
      new: true,
    }
  )
    .then((event) => {
      return event;
    })
    .catch((err) => {
      next(err);
    });
}

export async function deleteEventID(eventID, next) {
  await dbConnect();

  return EventData.findOneAndDelete({ _id: eventID })
    .then(() => {
      return;
    })
    .catch(next);
}

export async function updateEventID(eventID, event, next) {
  await dbConnect();

  return EventData.findByIdAndUpdate(eventID, event, {
    new: true,
    useFindAndModify: true,
  })
    .then(() => {
      return event;
    })
    .catch(next);
}

export async function getEventByID(eventID) {
  await dbConnect();

  return EventData.findById(eventID).then((event) => {
    return event;
  })
}
