import axios from "axios";
import { HydratedDocument, Types } from "mongoose";
import Attendance, {
  AttendanceData,
} from "../../server/mongodb/models/Attendance";

// Helper functions for checking in and out volunteers
export const checkInVolunteer = (userId: string, eventId: string) =>
  createAttendance({
    userId: new Types.ObjectId(userId),
    eventId: new Types.ObjectId(eventId),
    checkinTime: new Date(),
  });

export const checkOutVolunteer = async (userId: string, eventId: string) => {
  const attendanceId = (
    await Attendance.find({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      checkoutTime: null,
    })
  )[0].id as string;
  return updateAttendance(attendanceId, { checkoutTime: new Date() });
};

export const getAttendance = (attendanceId: string) =>
  axios.get<{
    attendance?: HydratedDocument<AttendanceData>;
    message?: string;
  }>(`/api/attendances/${attendanceId}`);

export const getAttendances = (
  userId?: Types.ObjectId,
  eventId?: Types.ObjectId,
  checkinTimeStart?: Date,
  checkinTimeEnd?: Date,
  checkoutTimeStart?: Date,
  checkoutTimeEnd?: Date
) =>
  axios.get<{ attendances?: HydratedDocument<AttendanceData>[] }>(
    "/api/attendances",
    {
      params: {
        userId,
        eventId,
        checkinTimeStart,
        checkinTimeEnd,
        checkoutTimeStart,
        checkoutTimeEnd,
      },
    }
  );

export const createAttendance = (attendanceData: AttendanceData) =>
  axios.post<{
    attendance?: HydratedDocument<AttendanceData>;
    message?: string;
  }>("/api/attendances", attendanceData);

export const updateAttendance = (
  attendanceId: string,
  attendanceData: Partial<AttendanceData>
) =>
  axios.put<{
    attendance?: HydratedDocument<AttendanceData>;
    message?: string;
  }>(`/api/attendances/${attendanceId}`, attendanceData);

export const deleteAttendance = (attendanceId: string) =>
  axios.delete<{ message?: string }>(`/api/attendances/${attendanceId}`);

export const getAttendanceStatistics = (
  eventId?: string,
  startDate?: Date,
  endDate?: Date
) =>
  axios.get<{
    statistics: {
      _id: string;
      num: number;
      users: Types.ObjectId[];
      minutes: number;
    }[];
  }>(`/api/attendances/statistics`, {
    params: { eventId, startDate, endDate },
  });
