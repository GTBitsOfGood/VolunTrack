import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  AttendanceDocument,
  AttendanceInputClient,
} from "../../server/mongodb/models/Attendance";
import { QueryPartialMatch } from "./index";

export type VolunteerAttendance = {
  _id: string;
  checkinTime: string | null;
  checkoutTime: string | null;
  minutes: number;
};

export type VolunteerClockStatus = {
  attendance: VolunteerAttendance | null;
  serverTime: string;
  clockInOpensAt: string;
  clockInClosesAt: string;
  clockOutClosesAt: string;
  isApproved: boolean;
  canClockIn: boolean;
  canClockOut: boolean;
};

const clockError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    return {
      error:
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : "Unable to reach attendance. Refresh your status and try again.",
      status: error.response?.status,
    };
  }
  return { error: "Unable to load or update attendance. Please try again." };
};

export type AttendanceReviewShift = {
  eventId: string;
  title: string;
  date: string;
  missingCheckinCount: number;
  missingCheckoutCount: number;
};

// Organization and issue classification are derived from the authenticated
// admin session on the server; this query deliberately accepts no filters.
export const getAttendanceNeedsReview = async () => {
  try {
    const response = await axios.get<{ shifts: AttendanceReviewShift[] }>(
      "/api/attendances/needs-review",
      { timeout: 10000 }
    );
    return { data: response.data, error: undefined };
  } catch (error) {
    return { data: undefined, ...clockError(error) };
  }
};

export const getMyAttendance = async (eventId: string) => {
  try {
    return await axios.get<VolunteerClockStatus>("/api/attendances/me", {
      params: { eventId },
      timeout: 10000,
    });
  } catch (error) {
    return clockError(error);
  }
};

const clockForShift = async (
  eventId: string,
  action: "clock-in" | "clock-out"
) => {
  try {
    return await axios.post<{
      attendance: VolunteerAttendance;
      serverTime: string;
    }>(`/api/attendances/${action}`, { eventId }, { timeout: 10000 });
  } catch (error) {
    return clockError(error);
  }
};

export const clockInForShift = (eventId: string) =>
  clockForShift(eventId, "clock-in");
export const clockOutForShift = (eventId: string) =>
  clockForShift(eventId, "clock-out");

// Helper functions for checking in and out volunteers
export const checkInVolunteer = async (
  userId: Types.ObjectId,
  eventId: Types.ObjectId,
  organizationId: Types.ObjectId,
  volunteerName: string,
  volunteerEmail: string,
  eventName: string
) => {
  try {
    const response = await createAttendance({
      userId,
      eventId,
      organizationId,
      volunteerName,
      volunteerEmail,
      eventName,
      checkinTime: new Date(),
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error checking in volunteer." };
  }
};

export const checkOutVolunteer = async (
  userId: Types.ObjectId | string,
  eventId: Types.ObjectId | string,
  options?: { attendanceId: Types.ObjectId | string; checkoutTime: Date }
) => {
  let attendanceId = options?.attendanceId;
  if (!attendanceId) {
    const response = await getAttendances({
      userId,
      eventId,
    } as QueryPartialMatch);
    if ("error" in response) return response;
    const open =
      response.data.attendances?.filter(
        (a) => a.checkinTime != null && a.checkoutTime == null
      ) ?? [];
    if (open.length !== 1)
      return {
        error: "Choose a specific open attendance entry and refresh.",
        status: 409,
      };
    attendanceId = open[0]._id;
  }
  return updateAttendance(attendanceId, {
    userId,
    eventId,
    checkoutTime: options?.checkoutTime ?? new Date(),
    onlyIfOpen: true,
  });
};

export const setEventAttendanceEnded = async (
  eventId: string,
  isEnded: boolean
) => {
  try {
    return await axios.patch<{ event: { _id: string; isEnded: boolean } }>(
      `/api/events/${eventId}`,
      { isEnded }
    );
  } catch (error) {
    return clockError(error);
  }
};

export const getAttendance = async (attendanceId: Types.ObjectId) => {
  try {
    const response = await axios.get<{
      attendance?: AttendanceDocument;
      error?: ZodError | string;
    }>(`/api/attendances/${attendanceId.toString()}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching attendance." };
  }
};

export const getAttendances = async (
  query: QueryPartialMatch,
  checkinTimeStart?: Date,
  checkinTimeEnd?: Date,
  checkoutTimeStart?: Date | null,
  checkoutTimeEnd?: Date | null
) => {
  try {
    const response = await axios.get<{
      attendances?: AttendanceDocument[];
      error?: ZodError | string;
    }>("/api/attendances", {
      params: {
        userId: query.userId,
        eventId: query.eventId,
        organizationId: query.organizationId,
        checkinTimeStart,
        checkinTimeEnd,
        checkoutTimeStart,
        checkoutTimeEnd,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error fetching attendances." };
  }
};

export const createAttendance = async (
  attendanceInput: AttendanceInputClient
) => {
  try {
    const response = await axios.post<{
      attendance?: AttendanceDocument;
      error?: ZodError | string;
    }>("/api/attendances", attendanceInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
        status: error.response?.status,
      };
    }
    return { error: "Error creating attendance." };
  }
};

export const updateAttendance = async (
  attendanceId: Types.ObjectId | string,
  attendanceInput: Omit<
    Partial<AttendanceInputClient>,
    "userId" | "eventId"
  > & {
    userId?: Types.ObjectId | string;
    eventId?: Types.ObjectId | string;
    onlyIfOpen?: boolean;
    expectedPunches?: {
      checkinTime: Date | string | null;
      checkoutTime: Date | string | null;
    };
  }
) => {
  try {
    const response = await axios.put<{
      attendance?: AttendanceDocument;
      error?: ZodError | string;
    }>(`/api/attendances/${attendanceId.toString()}`, attendanceInput);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
        status: error.response?.status,
      };
    }
    return { error: "Error updating attendance." };
  }
};

export const deleteAttendance = async (attendanceId: Types.ObjectId) => {
  try {
    const response = await axios.delete<{ error?: ZodError | string }>(
      `/api/attendances/${attendanceId.toString()}`
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error deleting attendance." };
  }
};

export const getAttendanceStatistics = async (
  organizationId?: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
) => {
  try {
    const response = await axios.get<
      {
        statistics?: {
          _id: string;
          num: number;
          users: Types.ObjectId[];
          minutes: number;
        };
      }[]
    >("/api/attendances/statistics", {
      params: { organizationId, startDate, endDate },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || error.message,
      };
    }
    return { error: "Error getting attendance statistics." };
  }
};
