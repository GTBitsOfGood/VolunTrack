import axios from "axios";
import { ZodError } from "zod";
import { OrganizationData } from "../../server/mongodb/models/Organization";
import { ApiReturnType } from "../types/queries";

export const getOrganization = (organizationId: string) => {
  return axios.get<ApiReturnType<OrganizationData, "organization">>(
    `/api/organizations/${organizationId}`
  );
};

export const getOrganizations = (
  organizationData?: Partial<OrganizationData>
) => {
  return axios.get<ApiReturnType<OrganizationData, "organizations", true>>(
    "/api/organizations",
    {
      params: organizationData,
    }
  );
};

export const createOrganization = (organizationData: OrganizationData) => {
  return axios.post<ApiReturnType<OrganizationData, "organization">>(
    "/api/organizations",
    organizationData
  );
};

export const updateOrganization = (
  organizationId: string,
  organizationData: Partial<OrganizationData>
) => {
  return axios.put<ApiReturnType<OrganizationData, "organization">>(
    `/api/organizations/${organizationId}`,
    organizationData
  );
};

export const toggleOrganizationActive = (organizationId: string) => {
  return axios.post<ApiReturnType<OrganizationData, "organization">>(
    `/api/organizations/${organizationId}/toggleActive`
  );
};

export const getInvitedAdmins = (organizationId: string) => {
  return axios.get<
    | { success: true; invitedAdmins: string[] }
    | { success: false; error: ZodError | string }
  >(`/api/organizations/${organizationId}/invitedAdmins`);
};

export const addInvitedAdmin = (organizationId: string, email: string) => {
  return axios.post<
    | { success: true; invitedAdmins: string[] }
    | { success: false; error: ZodError | string }
  >(`/api/organizations/${organizationId}/invitedAdmins`, { data: email });
};

export const deleteInvitedAdmin = (organizationId: string, email: string) => {
  return axios.delete<
    | { success: true; invitedAdmins: string[] }
    | { success: false; error: ZodError | string }
  >(`/api/organizations/${organizationId}/invitedAdmins`, { data: email });
};
