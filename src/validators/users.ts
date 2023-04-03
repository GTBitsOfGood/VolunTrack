import axios from "axios";
import { HydratedDocument, Types } from "mongoose";
import { UserData } from "../../server/mongodb/models/User";

export const getUser = (userId: string) =>
  axios.get<{ user?: HydratedDocument<UserData>; message?: string }>(
    `/api/users/${userId}`
  );

export const getUsers = (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  isCheckedIn?: boolean
) =>
  axios.get<{ users?: HydratedDocument<UserData>[]; message?: string }>(
    "/api/users",
    {
      params: { organizationId, role, eventId, isCheckedIn },
    }
  );

export const createUserFromCredentials = (
  userData: Omit<UserData, "password"> & { password: string }
) =>
  axios.post<{ user?: HydratedDocument<UserData>; message?: string }>(
    "/api/users",
    userData
  );

export const updateUser = (userId: string, userData: Partial<UserData>) =>
  axios.put<{ user?: HydratedDocument<UserData>; message?: string }>(
    `/api/users/${userId}`,
    userData
  );

export const deleteUser = (userId: string) =>
  axios.delete(`/api/users/${userId}`);
