import axios from "axios";
import { ZodError } from "zod";
import {
  HistoryEventDocument,
  HistoryEventInputClient,
} from "../../server/mongodb/models/HistoryEvent";

export const getHistoryEvents = (
  historyEventInput?: Partial<HistoryEventInputClient>
) =>
  axios.get<{
    historyEvents?: HistoryEventDocument[];
    error: ZodError | string;
  }>("/api/historyEvents", {
    params: historyEventInput,
  });
