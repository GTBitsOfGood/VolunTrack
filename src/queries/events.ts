import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  EventDocument,
  EventInputClient,
  EventPopulatedDocument,
  EventPopulatedInputClient,
} from "../../server/mongodb/models/Event";
import {
  UserDocument,
  UserInputClient,
} from "../../server/mongodb/models/User";

export const getEvent = async (eventId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      event?: EventPopulatedDocument;
      error?: ZodError | string;
    }>(`/api/events/${eventId.toString()}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching event." };
  }
};

export const getEvents = async (
  organizationId: Types.ObjectId,
  startDateString?: string,
  endDateString?: string
) => {
  try {
    const response = await axios.get<{
      events?: EventPopulatedDocument[];
      error?: ZodError | string;
    }>("/api/events", {
      params: {
        organizationId,
        startDateString,
        endDateString,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching events." };
  }
};

/**
 * The browser's wall clock as "YYYY-MM-DDTHH:mm" (what "upcoming" is judged
 * by).
 */
export const localWallClock = (date = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export type EventFeedQuery = {
  view: "upcoming" | "month" | "all" | "public" | "private" | "day" | "home";
  page?: number;
  pageSize?: number;
  day?: string;
  month?: string;
  dates?: boolean;
};

/** One page of shifts for the Events and Home pages, plus calendar days. */
export const getEventFeed = async (query: EventFeedQuery) => {
  try {
    const response = await axios.get<{
      events?: EventPopulatedDocument[];
      total?: number;
      dates?: string[];
      error?: string;
    }>("/api/events/feed", {
      params: {
        ...query,
        dates: query.dates ? "1" : undefined,
        now: localWallClock(),
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching events." };
  }
};

export type HomeSummary = {
  firstDate: string;
  todaysEvents: number;
  todaysRegistrations: number;
  eventTotal: number;
  attendanceTotal: number;
  hoursTotal: number;
  eventData: number[];
  hoursData: number[];
  attendanceData: number[];
};

/** The Overview numbers and charts on the admin Home page. */
export const getHomeSummary = async () => {
  try {
    const response = await axios.get<HomeSummary>("/api/events/home-summary", {
      params: { today: localWallClock().slice(0, 10) },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching the overview." };
  }
};

/** Creates a new event with it's own event parent */
export const createEvent = async (
  eventPopulatedInput: EventPopulatedInputClient
) => {
  try {
    const response = await axios.post<{
      event?: EventPopulatedDocument;
      error?: ZodError | string;
    }>("/api/events", eventPopulatedInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error creating event." };
  }
};

/** Creates a new event under an existing event parent */
export const createChildEvent = async (eventInput: EventInputClient) => {
  try {
    const response = await axios.post<{
      event?: EventDocument;
      error?: ZodError | string;
    }>("/api/events", eventInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error creating child event." };
  }
};

/** Updates an event and event parent */
export const updateEvent = async (
  eventId: Types.ObjectId,
  eventPopulatedInput: Partial<EventPopulatedInputClient>,
  sendConfirmationEmail = true,
  recurringEvent = false
) => {
  try {
    const response = await axios.put<{
      event?: EventPopulatedDocument;
      error?: ZodError | string;
    }>(`/api/events/${eventId.toString()}`, {
      eventPopulatedInput,
      sendConfirmationEmail,
      recurringEvent,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating event." };
  }
};

/** Updates a single event, no event parent */
export const updateChildEvent = async (
  eventId: Types.ObjectId,
  eventInput: Partial<EventInputClient>,
  sendConfirmationEmail = true
) => {
  try {
    const response = await axios.put<{
      event?: EventDocument;
      error?: ZodError | string;
    }>(`/api/events/${eventId.toString()}`, {
      eventInput,
      sendConfirmationEmail,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating child event." };
  }
};

export const createUserFromCheckIn = async (
  eventId: Types.ObjectId,
  userInput: UserInputClient,
  eventName: string
) => {
  try {
    const response = await axios.post<{
      user?: UserDocument;
      error?: ZodError | string;
    }>(`/api/events/${eventId.toString()}/dayOfCheckIn`, {
      userInput,
      eventName,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error creating user from check in." };
  }
};

export const deleteEvent = async (
  eventId: Types.ObjectId,
  recurringEvent: boolean
) => {
  try {
    const response = await axios.delete<{ error?: ZodError | string }>(
      `/api/events/${eventId.toString()}`,
      {
        data: {
          recurringEvent: recurringEvent,
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting event." };
  }
};
