import axios from "axios";
import { RegistrationData } from "../../server/mongodb/models/Registration";
import { ApiReturnType } from "../types/queries";

export const getRegistrations = (eventId?: string, userId?: string) =>
  axios.get<ApiReturnType<RegistrationData, "registrations", true>>(
    "/api/registrations",
    {
      params: {
        eventId,
        userId,
      },
    }
  );

export const createRegistration = (registrationData: RegistrationData) =>
  axios.post<ApiReturnType<RegistrationData, "registration">>(
    "/api/registrations",
    registrationData
  );
