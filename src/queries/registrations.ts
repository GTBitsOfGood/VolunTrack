import axios from "axios";
import { HydratedDocument } from "mongoose";
import { RegistrationData } from "../../server/mongodb/models/Registration";

export const getRegistrations = (eventId?: string, userId?: string) =>
  axios.get<{
    registrations?: HydratedDocument<RegistrationData>[];
    message?: string;
  }>("/api/registrations", {
    params: {
      eventId,
      userId,
    },
  });

export const createRegistration = (registrationData: RegistrationData) =>
  axios.post<{
    registration?: HydratedDocument<RegistrationData>;
    message?: string;
  }>("/api/registrations", registrationData);
