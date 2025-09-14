import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  RegistrationDocument,
  RegistrationInputClient,
} from "../../server/mongodb/models/Registration";
import { QueryPartialMatch } from "./index";

export const getRegistrations = async (query: QueryPartialMatch) => {
  try {
    const response = await axios.get<{
      registrations?: RegistrationDocument[];
      error?: ZodError | string;
    }>("/api/registrations", {
      params: {
        organizationId: query.organizationId,
        eventId: query.eventId,
        userId: query.userId,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting registrations." };
  }
};

export const registerForEvent = async (
  registrationInput: RegistrationInputClient
) => {
  try {
    const response = await axios.post<{
      registration?: RegistrationDocument;
      error?: ZodError | string;
    }>(`/api/registrations`, registrationInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error registering for event." };
  }
};

export const unregisterForEvent = async (
  eventId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  try {
    const response = await axios.delete<{ error?: ZodError | string }>(
      `/api/registrations`,
      {
        params: {
          eventId,
          userId,
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error unregistering for event." };
  }
};

export const deleteRegistration = async (registrationId: Types.ObjectId) => {
  try {
    const response = await axios.delete<{ error?: ZodError | string }>(
      `/api/registrations/${registrationId.toString()}`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting registration." };
  }
};

export const editRegistration = async (
  registrationId: Types.ObjectId,
  updatedData: Partial<RegistrationDocument>
) => {
  try {
    const response = await axios.patch<{
      registration?: RegistrationDocument;
      error?: string;
    }>("/api/registrations", { registrationId, ...updatedData });
    return response.data;
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
};

export const getPendingRegistrations = async (organizationId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      pendingRegistrations?: RegistrationDocument[];
      error?: string;
    }>("/api/registrations/pending", {
      params: {
        organizationId: organizationId.toString(),
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting pending registrations." };
  }
};

export const approveRegistration = async (registrationId: Types.ObjectId) => {
  try {
    const response = await axios.patch<{
      message?: string;
      registration?: RegistrationDocument;
      error?: string;
    }>(`/api/registrations/${registrationId.toString()}/approve`, {
      action: "approve"
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error approving registration." };
  }
};

export const denyRegistration = async (registrationId: Types.ObjectId, reason?: string) => {
  try {
    const response = await axios.patch<{
      message?: string;
      registration?: RegistrationDocument;
      error?: string;
    }>(`/api/registrations/${registrationId.toString()}/approve`, {
      action: "deny",
      reason: reason
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error denying registration." };
  }
};
