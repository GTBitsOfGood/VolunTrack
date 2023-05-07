import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  RegistrationDocument,
  RegistrationInputClient,
} from "../../server/mongodb/models/Registration";
import { QueryPartialMatch } from "./index";

export const getRegistrations = (query: QueryPartialMatch) =>
  axios.get<{
    registrations?: RegistrationDocument[];
    error?: ZodError | string;
  }>("/api/registrations", {
    params: {
      organizationId: query.organizationId,
      eventId: query.eventId,
      userId: query.userId,
    },
  });

export const registerForEvent = (registrationInput: RegistrationInputClient) =>
  axios.post<{
    registration?: RegistrationDocument;
    error?: ZodError | string;
  }>(`/api/registrations`, registrationInput);

export const unregisterForEvent = async (
  eventId: Types.ObjectId,
  userId: Types.ObjectId
) =>
  await axios.delete<{ error?: ZodError | string }>(`/api/registrations`, {
    params: {
      eventId,
      userId,
    },
  });

export const deleteRegistration = (registrationId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/registrations/${registrationId.toString()}`
  );
