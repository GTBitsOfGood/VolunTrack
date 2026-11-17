import axios from "axios";
import { ZodError } from "zod";
import {
  HistoryEventDocument,
  HistoryEventInputClient,
} from "../../server/mongodb/models/HistoryEvent";

/** One page of the History table, newest first, searched on the server. */
export const getHistoryPage = async (
  page: number,
  pageSize: number,
  search: string
) => {
  try {
    const response = await axios.get<{
      historyEvents: (HistoryEventDocument & {
        firstName: string;
        lastName: string;
      })[];
      total: number;
      page: number;
      pageSize: number;
    }>("/api/historyEvents", { params: { page, pageSize, search } });
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
