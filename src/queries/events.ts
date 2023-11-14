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

export const getEvent = (eventId: Types.ObjectId) =>
  axios.get<{ event?: EventPopulatedDocument; error?: ZodError | string }>(
    `/api/events/${eventId.toString()}`
  );

export const getEvents = (
  organizationId: Types.ObjectId,
  startDateString?: string,
  endDateString?: string
) => {
  return axios.get<{
    events?: EventPopulatedDocument[];
    error?: ZodError | string;
  }>("/api/events", {
    params: {
      organizationId,
      startDateString,
      endDateString,
    },
  });
};

/** Creates a new event with it's own event parent */
export const createEvent = (eventPopulatedInput: EventPopulatedInputClient) =>
  axios.post<{
    event?: Omit<EventPopulatedDocument, "isRecurringString">;
    error?: ZodError | string;
  }>("/api/events", eventPopulatedInput);

/** Creates a new event under an existing event parent */
export const createChildEvent = (eventInput: EventInputClient) =>
  axios.post<{
    event?: EventDocument;
    error?: ZodError | string;
  }>("/api/events", eventInput);

/** Updates an event and event parent */
export const updateEvent = (
  eventId: Types.ObjectId,
  eventPopulatedInput: Partial<EventPopulatedInputClient>,
  allRecurrence: Boolean,
  sendConfirmationEmail = true
) =>
  axios.put<{
    event?: Omit<EventPopulatedDocument, "isRecurringString">;
    error?: ZodError | string;
  }>(`/api/events/${eventId.toString()}`, {
    eventPopulatedInput,
    allRecurrence,
    sendConfirmationEmail,
  });

/** Updates a single event, no event parent */
export const updateChildEvent = (
  eventId: Types.ObjectId,
  eventInput: Partial<EventInputClient>,
  sendConfirmationEmail = true
) =>
  axios.put<{ event?: EventDocument; error?: ZodError | string }>(
    `/api/events/${eventId.toString()}`,
    {
      eventInput,
      sendConfirmationEmail,
    }
  );

export const createUserFromCheckIn = (
  eventId: Types.ObjectId,
  userInput: UserInputClient,
  eventName: string
) =>
  axios.post<{ user?: UserDocument; error?: ZodError | string }>(
    `/api/events/${eventId.toString()}/dayOfCheckIn`,
    { userInput, eventName }
  );

export const deleteEvent = (eventId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/events/${eventId.toString()}`
  );

export const deleteAllRecurringEvents = (eventId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/events/${eventId.toString()}/deleteAllRecurring`
  );
