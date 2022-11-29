import dbConnect from "../mongodb/index";
import HistoryEvent from "../mongodb/models/HistoryEvent";

export const getAllHistoryEvents = async () => {
  await dbConnect();

  const historyEvents = await HistoryEvent.find({}).sort("createdAt");
  return historyEvents;
};

export const createHistoryEvent = async (historyEventData) => {
  await dbConnect();

  const historyEvent = await HistoryEvent.create(historyEventData);
  return historyEvent;
};

export const createHistoryEventCreateEvent = (eventData) => {
  createHistoryEvent({
    userId: eventData.userId,
    keyword: "CREATED",
    eventId: eventData._id,
  });
};

export const createHistoryEventEditEvent = (eventData) => {
  createHistoryEvent({
    userId: eventData.userId,
    keyword: "MODIFIED",
    eventId: eventData._id,
  });
};

export const createHistoryEventDeleteEvent = (eventId, userId) => {
  createHistoryEvent({
    userId,
    keyword: "DELETED",
    eventId,
  });
};

export const createHistoryEventEditProfile = (userId) => {
  createHistoryEvent({
    userId,
    keyword: "MODIFIED",
  });
};

export const createHistoryEventDeleteProfile = (userId) => {
  createHistoryEvent({
    userId,
    keyword: "DELETED",
  });
};
