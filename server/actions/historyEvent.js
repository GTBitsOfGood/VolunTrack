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
