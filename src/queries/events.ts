import axios, { AxiosResponse } from "axios";
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
    eventParent: Types.ObjectId | Partial<EventParentData>;
  }
>;

export const getEvent = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ event?: HydratedDocument<EventPopulatedData> }>> =>
  axios.get<{ event?: HydratedDocument<EventPopulatedData> }>(
    `/api/events/${id.toString()}`
  );

export const getEvents = (
  startDateString: string,
  endDateString: string,
  organizationId: Types.ObjectId
): Promise<AxiosResponse<{ events: HydratedDocument<EventPopulatedData>[] }>> =>
  axios.get<{ events: HydratedDocument<EventPopulatedData>[] }>(
    `/api/events?startDate=${startDateString}&endDate=${endDateString}&organizationId=${organizationId.toString()}`
  );

export const createEvent = (
  eventData: CreateEventRequestBody
): Promise<
  AxiosResponse<{
    event: HydratedDocument<EventData>;
    eventParent?: HydratedDocument;
  }>
> =>
  axios.post<{ eventId: Types.ObjectId; eventParentId?: Types.ObjectId }>(
    "/api/events",
    eventData
  );

export const updateEvent = (
  id: Types.ObjectId,
  eventData: UpdateEventRequestBody,
  sendConfirmationEmail: boolean
): Promise<AxiosResponse<{ eventId?: Types.ObjectId }>> =>
  axios.put<{ eventId?: Types.ObjectId }>(`/api/events/${id.toString()}`, {
    eventData,
    sendConfirmationEmail,
  });

export const deleteEvent = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ eventId?: Types.ObjectId }>> =>
  axios.delete<{ eventId?: Types.ObjectId }>(`/api/events/${id.toString()}`);
