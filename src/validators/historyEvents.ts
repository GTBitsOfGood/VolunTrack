import axios from "axios";
import { HydratedDocument } from "mongoose";
import { HistoryEventData } from "../../server/mongodb/models/HistoryEvent";

export const getHistoryEvents = (historyEventData: Partial<HistoryEventData>) =>
  axios.get<{
    historyEvents?: HydratedDocument<HistoryEventData>[];
    message?: string;
  }>("/api/historyEvents", {
    params: historyEventData,
  });
