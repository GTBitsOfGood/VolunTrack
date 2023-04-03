import axios from "axios";
import { HydratedDocument } from "mongoose";
import { WaiverData } from "../../server/mongodb/models/Waiver";

export const getWaivers = async (
  type: "adult" | "minor",
  organizationId: string
) =>
  axios.get<{ waivers?: HydratedDocument<WaiverData>[]; message?: string }>(
    "/api/waivers",
    {
      params: { type, organizationId },
    }
  );

export const updateWaiver = async (
  waiverId: string,
  waiverData: Partial<WaiverData>
) =>
  axios.put<{ waiver?: HydratedDocument<WaiverData>; message?: string }>(
    `/api/waivers/${waiverId}`,
    waiverData
  );
