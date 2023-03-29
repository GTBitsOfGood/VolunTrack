import axios, { AxiosResponse } from "axios";
import { HydratedDocument, Types } from "mongoose";
import { OrganizationData } from "../../server/mongodb/models/Organization";

export const getOrganizations = (
  organizationData?: Partial<OrganizationData>
): Promise<
  AxiosResponse<{ organizations: HydratedDocument<OrganizationData>[] }>
> => {
  return axios.get<{ organizations: HydratedDocument<OrganizationData>[] }>(
    "/api/organizations",
    {
      params: organizationData,
    }
  );
};

export const createOrganization = (
  organizationData: OrganizationData
): Promise<AxiosResponse<{ organizationId?: Types.ObjectId }>> => {
  return axios.post<{ organizationId?: Types.ObjectId }>(
    "/api/organizations",
    organizationData
  );
};

export const updateOrganization = (
  id: Types.ObjectId,
  organizationData: Partial<OrganizationData>
): Promise<AxiosResponse<{ organizationId?: Types.ObjectId }>> => {
  return axios.put<{ organizationId?: Types.ObjectId }>(
    `/api/organizations/${id.toString()}`,
    organizationData
  );
};

export const getInvitedAdmins = (
  organizationId: Types.ObjectId
): Promise<AxiosResponse<{ invitedAdmins?: string[] }>> => {
  return axios.get<{ invitedAdmins?: string[] }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`
  );
};

export const addInvitedAdmin = (
  organizationId: Types.ObjectId,
  email: string
): Promise<AxiosResponse<{ organizationId?: Types.ObjectId }>> => {
  return axios.post<{ organizationId?: Types.ObjectId }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`,
    email
  );
};

export const deleteInvitedAdmin = (
  organizationId: Types.ObjectId,
  email: string
): Promise<AxiosResponse<{ organizationId?: Types.ObjectId }>> => {
  return axios.delete<{ organizationId?: Types.ObjectId }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`,
    { data: email }
  );
};
