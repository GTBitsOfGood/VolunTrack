import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  WaiverDocument,
  WaiverInputClient,
} from "../../server/mongodb/models/Waiver";

export const getWaivers = async (
  type: "adult" | "minor",
  organizationId: Types.ObjectId
) => {
  try {
    const response = await axios.get<{
      waivers?: WaiverDocument[];
      error?: ZodError | string;
    }>("/api/waivers", {
      params: { type, organizationId },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting waivers." };
  }
};

export const updateWaiver = async (waiverInput: Partial<WaiverInputClient>) => {
  try {
    const response = await axios.post<{
      waiver?: WaiverDocument;
      error?: ZodError | string;
    }>(`/api/waivers`, waiverInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error updating waivers." };
  }
};
