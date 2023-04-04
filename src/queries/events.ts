import axios from "axios";
import {
  EventData,
  EventPopulatedData,
} from "../../server/mongodb/models/Event";
import { ApiDeleteReturnType, ApiReturnType } from "../types/queries";
import { EventInputData, EventPopulatedInputData } from "../validators/events";

export const getEvent = (eventId: string) =>
  axios.get<ApiReturnType<EventPopulatedData, "event">>(
    `/api/events/${eventId}`
  );

export const getEvents = (
  organizationId: string,
  startDateString?: string,
  endDateString?: string
) => {
  return axios.get<ApiReturnType<EventPopulatedData, "events", true>>(
    "/api/events",
    {
      params: {
        organizationId,
        startDateString,
        endDateString,
      },
    }
  );
};

/** Creates a new event with it's own event parent */
export const createEvent = (eventInputPopulatedData: EventPopulatedInputData) =>
  axios.post<ApiReturnType<EventPopulatedData, "event">>(
    "/api/events",
    eventInputPopulatedData
  );

/** Creates a new event under an existing event parent */
export const createChildEvent = (eventInputData: EventInputData) =>
  axios.post<ApiReturnType<EventData, "event">>(
    "/api/events/child",
    eventInputData
  );

/** Updates an event and event parent */
export const updateEvent = (
  eventId: string,
  eventData: Partial<EventPopulatedInputData>,
  sendConfirmationEmail = true
) =>
  axios.put<ApiReturnType<EventPopulatedData, "event">>(
    `/api/events/${eventId}`,
    {
      eventData,
      sendConfirmationEmail,
    }
  );

/** Updates a single event, no event parent */
export const updateChildEvent = (
  eventId: string,
  eventData: Partial<EventInputData>,
  sendConfirmationEmail = true
) =>
  axios.put<ApiReturnType<EventData, "event">>(`/api/events/${eventId}`, {
    eventData,
    sendConfirmationEmail,
  });

export const deleteEvent = (eventId: string) =>
  axios.delete<ApiDeleteReturnType>(`/api/events/${eventId}`);
