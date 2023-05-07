import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  WaiverDocument,
  WaiverInputClient,
} from "../../server/mongodb/models/Waiver";

export const getWaivers = (
  type: "adult" | "minor",
  organizationId: Types.ObjectId
) =>
  axios.get<{ waivers?: WaiverDocument[]; error?: ZodError | string }>(
    "/api/waivers",
    {
      params: { type, organizationId },
    }
  );

export const updateWaiver = (waiverInput: Partial<WaiverInputClient>) =>
  axios.post<{ waiver?: WaiverDocument; error?: ZodError | string }>(
    `/api/waivers`,
    waiverInput
  );
