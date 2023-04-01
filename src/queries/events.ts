import axios from "axios";
import { HydratedDocument, Types } from "mongoose";
import {
  EventData,
  EventPopulatedData,
} from "../../server/mongodb/models/Event";
import { EventParentData } from "../../server/mongodb/models/EventParent";

export type CreateEventRequestBody = Omit<EventData, "eventParent"> & {
  eventParent: Types.ObjectId | EventParentData;
};
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

export const createEvent = (eventData: CreateEventRequestBody) =>
  axios.post<{
    event?: HydratedDocument<EventPopulatedData>;
    message?: string;
  }>("/api/events", eventData);

export const updateEvent = (
  eventId: string,
  eventData: UpdateEventRequestBody,
  sendConfirmationEmail = true
) =>
  axios.put<{ event?: HydratedDocument<EventPopulatedData>; message?: string }>(
    `/api/events/${eventId}`,
    {
      eventData,
      sendConfirmationEmail,
    }
  );

export const deleteEvent = (eventId: string) =>
  axios.delete<{ message?: string }>(`/api/events/${eventId}`);
