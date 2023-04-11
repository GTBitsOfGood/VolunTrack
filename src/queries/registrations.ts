import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  RegistrationDocument,
  RegistrationInputClient,
} from "../../server/mongodb/models/Registration";

export const getRegistrations = (
  eventId?: Types.ObjectId,
  userId?: Types.ObjectId
) =>
  axios.get<{
    registrations?: RegistrationDocument[];
    error?: ZodError | string;
  }>("/api/registrations", {
    params: {
      eventId,
      userId,
    },
  });

export const createRegistration = (
  registrationInput: RegistrationInputClient
) =>
  axios.post<{
    registration?: RegistrationDocument;
    error?: ZodError | string;
  }>(`/api/registrations`, registrationInput);

export const deleteRegistration = (registrationId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/registrations/${registrationId.toString()}`
  );

// Registration helper functions
export const registerForEvent = createRegistration;

export const unregisterForEvent = async (
  eventId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const registrationResponse = await getRegistrations(eventId, userId);
  const registrations = registrationResponse.data.registrations;
  if (registrations === undefined || registrations.length === 0)
    return {
      error: `No registrations with eventId ${eventId.toString()} and userId ${userId.toString()} found`,
    };

  const registrationId = registrations[0]._id;
  return deleteRegistration(registrationId);
};
