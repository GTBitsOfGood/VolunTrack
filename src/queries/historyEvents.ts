import axios, { AxiosResponse } from "axios";
import { HydratedDocument } from "mongoose";
import { HistoryEventData } from "../../server/mongodb/models/HistoryEvent";

export const getHistoryEvents = (
  historyEventData: Partial<HistoryEventData>
): Promise<
  AxiosResponse<{ historyEvents: HydratedDocument<HistoryEventData>[] }>
> =>
  axios.get<{ historyEvents: HydratedDocument<HistoryEventData>[] }>(
    "/api/historyEvents",
    {
      params: historyEventData,
    }
  );
