import axios from "axios";
import { HydratedDocument } from "mongoose";
import { OrganizationData } from "../../server/mongodb/models/Organization";

export const getOrganization = (organizationId: string) => {
  return axios.get<{
    organization?: HydratedDocument<OrganizationData>;
    message?: string;
  }>(`/api/organizations/${organizationId}`);
};

export const getOrganizations = (
  organizationData?: Partial<OrganizationData>
) => {
  return axios.get<{ organizations: HydratedDocument<OrganizationData>[] }>(
    "/api/organizations",
    {
      params: organizationData,
    }
  );
};

export const createOrganization = (organizationData: OrganizationData) => {
  return axios.post<{
    organization?: HydratedDocument<OrganizationData>;
    message?: string;
  }>("/api/organizations", organizationData);
};

export const updateOrganization = (
  organizationId: string,
  organizationData: Partial<OrganizationData>
) => {
  return axios.put<{
    organization?: HydratedDocument<OrganizationData>;
    message?: string;
  }>(`/api/organizations/${organizationId}`, organizationData);
};

export const toggleOrganizationActive = (organizationId: string) => {
  return axios.post<{
    organization?: HydratedDocument<OrganizationData>;
    message?: string;
  }>(`/api/organizations/${organizationId}/toggleActive`);
};

export const getInvitedAdmins = (organizationId: string) => {
  return axios.get<{ invitedAdmins?: string[]; message?: string }>(
    `/api/organizations/${organizationId}/invitedAdmins`
  );
};

export const addInvitedAdmin = (organizationId: string, email: string) => {
  return axios.post<{ invitedAdmins?: string[]; message?: string }>(
    `/api/organizations/${organizationId}/invitedAdmins`,
    email
  );
};

export const deleteInvitedAdmin = (organizationId: string, email: string) => {
  return axios.delete<{ invitedAdmins?: string[]; message?: string }>(
    `/api/organizations/${organizationId}/invitedAdmins`,
    { data: email }
  );
};
