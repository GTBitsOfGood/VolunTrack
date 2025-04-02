import axios from "axios";
import { ZodError } from "zod";
import {
  HistoryEventDocument,
  HistoryEventInputClient,
} from "../../server/mongodb/models/HistoryEvent";

export const getHistoryEvents = async (
  historyEventInput?: Partial<HistoryEventInputClient>
) => {
  try {
    const response = await axios.get<{
      historyEvents?: HistoryEventDocument[];
      error: ZodError | string;
    }>("/api/historyEvents", {
      params: historyEventInput,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting history events." };
  }
};
