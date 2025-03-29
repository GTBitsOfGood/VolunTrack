import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import DOMPurify from "dompurify";
import {
  OrganizationDocument,
  OrganizationInputClient,
} from "../../server/mongodb/models/Organization";

export const getOrganization = async (organizationId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      organization?: OrganizationDocument;
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting organization." };
  }
};

export const getOrganizations = async (
  organizationInput?: Partial<OrganizationInputClient>
) => {
  try {
    const response = await axios.get<{
      organizations?: OrganizationDocument[];
      error?: ZodError | string;
    }>("/api/organizations", {
      params: organizationInput,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting organizations." };
  }
};

export const createOrganization = async (
  organizationInput: OrganizationInputClient
) => {
  try {
    const response = axios.post<{
      organization?: OrganizationDocument;
      error?: ZodError | string;
    }>("/api/organizations", organizationInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error creating organization." };
  }
};

export const updateOrganization = async (
  organizationId: Types.ObjectId,
  organizationInput: Partial<OrganizationInputClient>
) => {
  try {
    const response = await axios.put<{
      organization?: OrganizationDocument;
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}`, organizationInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating organization." };
  }
};

export const toggleOrganizationActive = async (
  organizationId: Types.ObjectId
) => {
  try {
    const response = await axios.post<{
      organization?: OrganizationDocument;
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}/toggleActive`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error toggling organization active." };
  }
};

export const getInvitedAdmins = async (organizationId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      invitedAdmins?: string[];
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}/invitedAdmins`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting invited admins." };
  }
};

export const getOrgAdmin = async (organizationId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      originalAdminEmail?: string;
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}/originalAdminEmail`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting organization admins." };
  }
};

export const addInvitedAdmin = async (
  organizationId: Types.ObjectId,
  email: string
) => {
  try {
    const response = await axios.post<{
      invitedAdmins?: string[];
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}/invitedAdmins`, {
      data: email,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error adding invited admin." };
  }
};

export const deleteInvitedAdmin = async (
  organizationId: Types.ObjectId,
  email: string
) => {
  try {
    const response = await axios.delete<{
      invitedAdmins?: string[];
      error?: ZodError | string;
    }>(`/api/organizations/${organizationId.toString()}/invitedAdmins`, {
      data: email,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting invited admin." };
  }
};

export const loadPage = async (organizationId: string) => {
  try {
    const response = await axios.get<{ homePage?: string; error?: string }>(
      `/api/organizations/${organizationId}/customHomePage`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error loading organization page." };
  }
};

export const submitPage = async (
  organizationId: string,
  pageContent: string
) => {
  try {
    const sanitizedHomePage = DOMPurify.sanitize(pageContent);

    const response = await axios.post<{ message: string; error?: string }>(
      `/api/organizations/${organizationId}/customHomePage`,
      { organizationId, homePage: sanitizedHomePage }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error submitting organization page." };
  }
};

export const getAboutPageToggle = async (organizationId: string) => {
  try {
    const response = await axios.get<{
      aboutPageToggle?: boolean;
      error?: string;
    }>(`/api/organizations/${organizationId}/aboutPageToggle`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting about page toggle." };
  }
};

export const setAboutPageToggle = async (
  organizationId: string,
  aboutPageToggle: boolean
) => {
  try {
    const response = await axios.post<{ message: string; error?: string }>(
      `/api/organizations/${organizationId}/aboutPageToggle`,
      { aboutPageToggle }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error setting about page toggle." };
  }
};
