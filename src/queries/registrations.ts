import axios from "axios";
import { RegistrationData } from "../../server/mongodb/models/Registration";
import { ApiReturnType } from "../types/queries";

export const getRegistrations = (
  organizationId?: string,
  eventId?: string,
  userId?: string
) =>
  axios.get<ApiReturnType<RegistrationData, "registrations", true>>(
    "/api/registrations",
    {
      params: {
        organizationId,
        eventId,
        userId,
      },
    }
  );

export const registerForEvent = async (data: any) =>
  (
    await axios.post<ApiReturnType<RegistrationData, "registrations", true>>(
      `/api/registrations`,
      data
    )
  ).data;

export const unregisterForEvent = async (eventId: string, userId: string) =>
  (
    await axios.delete<ApiReturnType<RegistrationData, "registrations", true>>(
      `/api/registrations`,
      {
        params: {
          eventId,
          userId,
        },
      }
    )
  ).data;
