import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  AttendanceDocument,
  AttendanceInputClient,
} from "../../server/mongodb/models/Attendance";
import { QueryPartialMatch } from "./index";

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
  userId: Types.ObjectId,
  eventId: Types.ObjectId
) => {
  const attendanceResponse = await getAttendances(
    {
      userId,
      eventId,
    },
    undefined,
    undefined,
    null,
    null
  );

  if ("error" in attendanceResponse) {
    console.error("Error fetching attendances:", attendanceResponse.error);
    return;
  }

  const attendanceId = attendanceResponse.data.attendances?.[0]._id;

  if (!attendanceId) return;
  return updateAttendance(attendanceId, { checkoutTime: new Date() });
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
      };
    }
    return { error: "Error creating attendance." };
  }
};

export const updateAttendance = async (
  attendanceId: Types.ObjectId,
  attendanceInput: Partial<AttendanceInputClient>
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
