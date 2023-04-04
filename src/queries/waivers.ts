import axios from "axios";
import { WaiverData } from "../../server/mongodb/models/Waiver";
import { ApiReturnType } from "../types/queries";

export const getWaivers = async (
  type: "adult" | "minor",
  organizationId: string
) =>
  axios.get<ApiReturnType<WaiverData, "waivers", true>>("/api/waivers", {
    params: { type, organizationId },
  });

export const updateWaiver = async (
  waiverId: string,
  waiverData: Partial<WaiverData>
) =>
  axios.put<ApiReturnType<WaiverData, "waiver">>(
    `/api/waivers/${waiverId}`,
    waiverData
  );
