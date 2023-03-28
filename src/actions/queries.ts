import axios, { AxiosResponse } from "axios";
import { Types } from "mongoose";
import {
  EventData,
  EventPopulatedData,
} from "../../server/mongodb/models/Event";
import { EventParentData } from "../../server/mongodb/models/EventParent";

export const getEvents = (
  startDateString: string,
  endDateString: string,
  organizationId: Types.ObjectId
): Promise<AxiosResponse<EventPopulatedData[]>> =>
  axios.get<EventPopulatedData[]>(
    `/api/events?startDate=${startDateString}&endDate=${endDateString}&organizationId=${organizationId.toString()}`
  );

export type CreateEventRequestBody = Omit<EventData, "eventParent"> & {
  eventParent: Types.ObjectId | EventParentData;
};
export type CreateEventResponseData = {
  eventId: Types.ObjectId;
  eventParentId?: Types.ObjectId;
};
export const createEvent = (
  eventData: CreateEventRequestBody
): Promise<AxiosResponse<CreateEventResponseData>> =>
  axios.post<CreateEventResponseData>("/api/events", eventData);

export type EditEventRequestBody = Partial<
  Omit<EventData, "eventParent"> & {
    eventParent: Types.ObjectId | Partial<EventParentData>;
  }
>;
export const editEvent = (
  id: Types.ObjectId,
  eventData: EditEventRequestBody
): Promise<AxiosResponse<string>> =>
  axios.put<string>(`/api/events/${id.toString()}`, eventData);

export const createRegistration = (
  minors: string[],
  event: Types.ObjectId,
  user: Types.ObjectId
): Promise<AxiosResponse<Types.ObjectId>> =>
  axios.post<Types.ObjectId>("/api/registrations", {
    minors,
    event,
    user,
  });

export const createAttendance = (
  event: Types.ObjectId,
  user: Types.ObjectId
): Promise<AxiosResponse<Types.ObjectId>> =>
  axios.post<Types.ObjectId>("/api/attendances", {
    event,
    user,
  });
