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
export type EditEventRequestBody = Partial<
  Omit<EventData, "eventParent"> & {
    eventParent: Types.ObjectId | Partial<EventParentData>;
  }
>;

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
  AxiosResponse<{ eventId: Types.ObjectId; eventParentId?: Types.ObjectId }>
> =>
  axios.post<{ eventId: Types.ObjectId; eventParentId?: Types.ObjectId }>(
    "/api/events",
    eventData
  );

export const editEvent = (
  id: Types.ObjectId,
  eventData: EditEventRequestBody,
  sendConfirmationEmail: boolean
): Promise<AxiosResponse<{ eventId: Types.ObjectId }>> =>
  axios.put<{ eventId: Types.ObjectId }>(`/api/events/${id.toString()}`, {
    eventData,
    sendConfirmationEmail,
  });

export const deleteEvent = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ eventId: Types.ObjectId }>> =>
  axios.delete<{ eventId: Types.ObjectId }>(`/api/events/${id.toString()}`);
