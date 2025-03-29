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
