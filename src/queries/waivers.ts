import axios, { AxiosResponse } from "axios";
import { HydratedDocument, Types } from "mongoose";
import { WaiverData } from "../../server/mongodb/models/Waiver";

export const getWaivers = async (
  type: "adult" | "minor",
  organizationId: string
): Promise<AxiosResponse<{ waivers: HydratedDocument<WaiverData>[] }>> =>
  axios.get<{ waivers: HydratedDocument<WaiverData>[] }>("/api/waivers", {
    params: { type, organizationId },
  });

export const updateWaiver = async (
  id: Types.ObjectId,
  waiverData: Partial<WaiverData>
): Promise<AxiosResponse<{ waiverId: Types.ObjectId }>> =>
  axios.put<{ waiverId: Types.ObjectId }>(
    `/api/waivers/${id.toString()}`,
    waiverData
  );
