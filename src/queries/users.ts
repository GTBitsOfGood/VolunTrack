import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  UserDocument,
  UserInputClient,
} from "../../server/mongodb/models/User";

export const getUser = (userId: Types.ObjectId) =>
  axios.get<{ user?: UserDocument; error?: ZodError | string }>(
    `/api/users/${userId.toString()}`
  );

export const getUsers = (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  checkinStatus?: "waiting" | "checkedIn" | "checkedOut"
) =>
  axios.get<{ users?: UserDocument[]; error?: ZodError | string }>(
    "/api/users",
    {
      params: { organizationId, role, eventId, checkinStatus },
    }
  );

export const createUserFromCredentials = (
  userInput: UserInputClient & { password: string }
) =>
  axios.post<{ user?: UserDocument; error?: ZodError | string }>(
    "/api/users",
    userInput
  );

export const updateUser = (
  userId: Types.ObjectId,
  userInput: Partial<UserInputClient>
) =>
  axios.put<{ user?: UserDocument; error?: ZodError | string }>(
    `/api/users/${userId.toString()}`,
    userInput
  );

export const deleteUser = (userId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/users/${userId.toString()}`
  );
