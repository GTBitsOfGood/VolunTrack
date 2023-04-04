import axios from "axios";
import { Types } from "mongoose";
import { UserData } from "../../server/mongodb/models/User";
import { ApiDeleteReturnType, ApiReturnType } from "../types/queries";

export const getUser = (userId: string) =>
  axios.get<ApiReturnType<UserData, "user">>(`/api/users/${userId}`);

export const getUsers = (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  isCheckedIn?: boolean
) =>
  axios.get<ApiReturnType<UserData, "users", true>>("/api/users", {
    params: { organizationId, role, eventId, isCheckedIn },
  });

export const createUserFromCredentials = (
  userData: Omit<UserData, "password"> & { password: string }
) => axios.post<ApiReturnType<UserData, "user">>("/api/users", userData);

export const updateUser = (userId: string, userData: Partial<UserData>) =>
  axios.put<ApiReturnType<UserData, "user">>(`/api/users/${userId}`, userData);

export const deleteUser = (userId: string) =>
  axios.delete<ApiDeleteReturnType>(`/api/users/${userId}`);
