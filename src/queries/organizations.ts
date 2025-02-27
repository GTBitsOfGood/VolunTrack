import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import DOMPurify from "dompurify";
import {
  OrganizationDocument,
  OrganizationInputClient,
} from "../../server/mongodb/models/Organization";

export const getOrganization = (organizationId: Types.ObjectId) => {
  return axios.get<{
    organization?: OrganizationDocument;
    error?: ZodError | string;
  }>(`/api/organizations/${organizationId.toString()}`);
};

export const getOrganizations = (
  organizationInput?: Partial<OrganizationInputClient>
) => {
  return axios.get<{
    organizations?: OrganizationDocument[];
    error?: ZodError | string;
  }>("/api/organizations", {
    params: organizationInput,
  });
};

export const createOrganization = (
  organizationInput: OrganizationInputClient
) => {
  return axios.post<{
    organization?: OrganizationDocument;
    error?: ZodError | string;
  }>("/api/organizations", organizationInput);
};

export const updateOrganization = (
  organizationId: Types.ObjectId,
  organizationInput: Partial<OrganizationInputClient>
) => {
  return axios.put<{
    organization?: OrganizationDocument;
    error?: ZodError | string;
  }>(`/api/organizations/${organizationId.toString()}`, organizationInput);
};

export const toggleOrganizationActive = (organizationId: Types.ObjectId) => {
  return axios.post<{
    organization?: OrganizationDocument;
    error?: ZodError | string;
  }>(`/api/organizations/${organizationId.toString()}/toggleActive`);
};

export const getInvitedAdmins = (organizationId: Types.ObjectId) => {
  return axios.get<{ invitedAdmins?: string[]; error?: ZodError | string }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`
  );
};

export const getOrgAdmin = (organizationId: Types.ObjectId) => {
  return axios.get<{ originalAdminEmail?: string; error?: ZodError | string }>(
    `/api/organizations/${organizationId.toString()}/originalAdminEmail`
  );
};

export const addInvitedAdmin = (
  organizationId: Types.ObjectId,
  email: string
) => {
  return axios.post<{ invitedAdmins?: string[]; error?: ZodError | string }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`,
    { data: email }
  );
};

export const deleteInvitedAdmin = (
  organizationId: Types.ObjectId,
  email: string
) => {
  return axios.delete<{ invitedAdmins?: string[]; error?: ZodError | string }>(
    `/api/organizations/${organizationId.toString()}/invitedAdmins`,
    { data: email }
  );
};


export const loadPage = (organizationId: string) => {
  return axios.get<{ homePage?: string; error?: string }>(
    `/api/organizations/${organizationId}/customHomePage`
  );
};


export const submitPage = async (organizationId: string, pageContent: string) => {

  const sanitizedHomePage = DOMPurify.sanitize(pageContent);

  return axios.post<{ message: string; error?: string }>(
    `/api/organizations/${organizationId}/customHomePage`,
    { organizationId, homePage: sanitizedHomePage }
  );
};
