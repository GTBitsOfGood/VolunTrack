import axios, { AxiosResponse } from "axios";
import { HydratedDocument, Types } from "mongoose";
import { UserData } from "../../server/mongodb/models/User";

export const getUser = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ user: HydratedDocument<UserData> }>> =>
  axios.get<{ user: HydratedDocument<UserData> }>(
    `/api/users/${id.toString()}`
  );

export const getUsers = (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager"
): Promise<AxiosResponse<{ users: HydratedDocument<UserData>[] }>> =>
  axios.get<{ users: HydratedDocument<UserData>[] }>("/api/users", {
    params: { organizationId, role },
  });

export const createUserFromCredentials = (
  userData: UserData & { password: string }
): Promise<AxiosResponse<{ userId: Types.ObjectId }>> =>
  axios.post<{ userId: Types.ObjectId }>("/api/users", userData);

export const updateUser = (
  id: Types.ObjectId,
  userData: Partial<UserData>
): Promise<AxiosResponse<{ userId: Types.ObjectId }>> =>
  axios.put<{ userId: Types.ObjectId }>(
    `/api/users/${id.toString()}`,
    userData
  );

export const deleteUser = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ userId: Types.ObjectId }>> =>
  axios.delete(`/api/users/${id.toString()}`);
