import axios from "axios";
import { HistoryEventData } from "../../server/mongodb/models/HistoryEvent";
import { ApiReturnType } from "../types/queries";

export const getHistoryEvents = (historyEventData: Partial<HistoryEventData>) =>
  axios.get<ApiReturnType<HistoryEventData, "historyEvents", true>>(
    "/api/historyEvents",
    {
      params: historyEventData,
    }
  );
