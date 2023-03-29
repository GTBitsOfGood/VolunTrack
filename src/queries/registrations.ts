import axios, { AxiosResponse } from "axios";
import { Types } from "mongoose";

export const createRegistration = (
  minors: string[],
  eventId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<AxiosResponse<{ registrationId: Types.ObjectId }>> =>
  axios.post<{ registrationId: Types.ObjectId }>("/api/registrations", {
    minors,
    eventId,
    userId,
  });
