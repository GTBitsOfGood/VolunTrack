import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  UserDocument,
  UserInputClient,
} from "../../server/mongodb/models/User";

export const getUser = async (userId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      user?: UserDocument;
      error?: ZodError | string;
    }>(`/api/users/${userId.toString()}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting user." };
  }
};

export const getUsers = async (
  organizationId?: Types.ObjectId,
  role?: "admin" | "volunteer" | "manager",
  eventId?: Types.ObjectId,
  checkinStatus?: "waiting" | "checkedIn" | "checkedOut"
) => {
  try {
    const response = await axios.get<{
      users?: UserDocument[];
      error?: ZodError | string;
    }>("/api/users", {
      params: { organizationId, role, eventId, checkinStatus },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting users." };
  }
};

export const createUserFromCredentials = async (
  userInput: UserInputClient & { password: string }
) => {
  try {
    const response = await axios.post<{
      user?: UserDocument;
      error?: ZodError | string;
    }>("/api/users", userInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error creating user from credentials." };
  }
};

export const updateUser = async (
  userId: Types.ObjectId,
  userInput: Partial<UserInputClient>
) => {
  try {
    const response = await axios.put<{
      user?: UserDocument;
      error?: ZodError | string;
    }>(`/api/users/${userId.toString()}`, userInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating user." };
  }
};

export const updateUserOrganizationId = async (
  userId: Types.ObjectId,
  orgCode: string
) => {
  try {
    const response = await axios.put<{
      user?: UserDocument;
      error?: ZodError | string;
    }>(`/api/users/${userId.toString()}/organizationCode`, { orgCode });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating user organization." };
  }
};

export const deleteUser = async (userId: Types.ObjectId) => {
  try {
    const response = await axios.delete<{ error?: ZodError | string }>(
      `/api/users/${userId.toString()}`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting user." };
  }
};

// reset password functionality
export const sendResetPasswordEmail = async (
  emailParam: string,
  isCheckedIn: boolean
) => {
  try {
    const response = await axios.post(`/api/auth/resetPassword?${emailParam}`, {
      isCheckedIn,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error sending reset password email." };
  }
};

export const deleteResetCode = async (code: string, userId: string) => {
  try {
    const response = await axios.delete(
      `/api/auth/resetPassword?code=${code}&userId=${userId}`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting reset code." };
  }
};

export const getUserIdFromCode = async (code: string) => {
  try {
    const response = await axios.get(`/api/auth/resetPassword?code=` + code);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting user id from code." };
  }
};
