import axios from "axios";
import { Types } from "mongoose";
import { ZodError } from "zod";
import {
  AttendanceDocument,
  AttendanceInputClient,
} from "../../server/mongodb/models/Attendance";
import { QueryPartialMatch } from "./index";

// Helper functions for checking in and out volunteers
export const checkInVolunteer = (
  userId: Types.ObjectId,
  eventId: Types.ObjectId,
  organizationId: Types.ObjectId
) =>
  createAttendance({
    userId,
    eventId,
    organizationId,
    checkinTime: new Date(),
  });

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
  const attendanceId = attendanceResponse.data.attendances?.[0]._id;

  if (!attendanceId) return;
  return updateAttendance(attendanceId, { checkoutTime: new Date() });
};

export const getAttendance = (attendanceId: Types.ObjectId) =>
  axios.get<{
    attendance?: AttendanceDocument;
    error?: ZodError | string;
  }>(`/api/attendances/${attendanceId.toString()}`);

export const getAttendances = (
  query: QueryPartialMatch,
  checkinTimeStart?: Date,
  checkinTimeEnd?: Date,
  checkoutTimeStart?: Date | null,
  checkoutTimeEnd?: Date | null
) =>
  axios.get<{
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

export const createAttendance = (attendanceInput: AttendanceInputClient) =>
  axios.post<{
    attendance?: AttendanceDocument;
    error?: ZodError | string;
  }>("/api/attendances", attendanceInput);

export const updateAttendance = (
  attendanceId: Types.ObjectId,
  attendanceInput: Partial<AttendanceInputClient>
) =>
  axios.put<{
    attendance?: AttendanceDocument;
    error?: ZodError | string;
  }>(`/api/attendances/${attendanceId.toString()}`, attendanceInput);

export const deleteAttendance = (attendanceId: Types.ObjectId) =>
  axios.delete<{ error?: ZodError | string }>(
    `/api/attendances/${attendanceId.toString()}`
  );

export const getAttendanceStatistics = (
  eventId?: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
) =>
  axios.get<
    {
      statistics?: {
        _id: string;
        num: number;
        users: Types.ObjectId[];
        minutes: number;
      };
    }[]
  >("/api/attendances/statistics", {
    params: { eventId, startDate, endDate },
  });
