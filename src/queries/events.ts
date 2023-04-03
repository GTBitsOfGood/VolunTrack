import axios from "axios";
import { HydratedDocument, Types } from "mongoose";
import {
  EventData,
  EventPopulatedData,
} from "../../server/mongodb/models/Event";
import { EventParentData } from "../../server/mongodb/models/EventParent";

export type UpdateEventRequestBody = Partial<
  Omit<EventData, "eventParent"> & {
    eventParent?: Types.ObjectId | Partial<EventParentData>;
  }
>;

export const getEvent = (eventId: string) =>
  axios.get<{ event?: HydratedDocument<EventPopulatedData>; message?: string }>(
    `/api/events/${eventId}`
  );

export const getEvents = (
  organizationId: string,
  startDateString?: string,
  endDateString?: string
) => {
  return axios.get<{ events: HydratedDocument<EventPopulatedData>[] }>(
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
export const createEvent = (eventData: EventPopulatedData) =>
  axios.post<{
    event?: HydratedDocument<EventPopulatedData>;
    message?: string;
  }>("/api/events", eventData);

/** Creates a new event under an existing event parent */
export const createChildEvent = (eventData: EventData) =>
  axios.post<{
    event?: HydratedDocument<EventData>;
    message?: string;
  }>("/api/events/child", eventData);

/** Updates an event and event parent */
export const updateEvent = (
  eventId: string,
  eventData: Partial<EventPopulatedData>,
  sendConfirmationEmail = true
) =>
  axios.put<{ event?: HydratedDocument<EventPopulatedData>; message?: string }>(
    `/api/events/${eventId}`,
    {
      eventData,
      sendConfirmationEmail,
    }
  );

/** Updates a single event, no event parent */
export const updateChildEvent = (
  eventId: string,
  eventData: Partial<EventData>,
  sendConfirmationEmail = true
) =>
  axios.put<{ event?: HydratedDocument<EventData>; message?: string }>(
    `/api/events/${eventId}`,
    {
      eventData,
      sendConfirmationEmail,
    }
  );

export const deleteEvent = (eventId: string) =>
  axios.delete<{ message?: string }>(`/api/events/${eventId}`);
