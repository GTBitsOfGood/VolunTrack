import axios, { AxiosResponse } from "axios";
import { HydratedDocument, Types } from "mongoose";
import Attendance, {
  AttendanceData,
} from "../../server/mongodb/models/Attendance";

// Helper functions for checking in and out volunteers
export const checkInVolunteer = (
  userId: Types.ObjectId,
  eventId: Types.ObjectId
) =>
  createAttendance({ user: userId, event: eventId, checkinTime: new Date() });

export const checkOutVolunteer = async (
  userId: Types.ObjectId,
  eventId: Types.ObjectId
) => {
  const attendanceId = (
    await Attendance.find({
      user: userId,
      event: eventId,
      checkoutTime: null,
    })
  )[0]._id;
  return updateAttendance(attendanceId, { checkoutTime: new Date() });
};

export const getAttendance = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ attendance?: HydratedDocument<AttendanceData> }>> =>
  axios.get<{ attendance?: HydratedDocument<AttendanceData> }>(
    `/api/attendances/${id.toString()}`
  );

export const getAttendances = (
  userId?: Types.ObjectId,
  eventId?: Types.ObjectId,
  checkinTimeBounds?: { start?: Date; end?: Date },
  checkoutTimeBounds?: { start?: Date; end?: Date }
): Promise<
  AxiosResponse<{ attendances: HydratedDocument<AttendanceData>[] }>
> =>
  axios.get<{ attendances: HydratedDocument<AttendanceData>[] }>(
    "/api/attendances",
    {
      params: { userId, eventId, checkinTimeBounds, checkoutTimeBounds },
    }
  );

export const createAttendance = (
  attendanceData: AttendanceData
): Promise<AxiosResponse<{ attendance: HydratedDocument<AttendanceData> }>> =>
  axios.post<{ attendance: HydratedDocument<AttendanceData> }>(
    "/api/attendances",
    attendanceData
  );

export const updateAttendance = (
  id: Types.ObjectId,
  attendanceData: Partial<AttendanceData>
): Promise<AxiosResponse<{ attendance?: HydratedDocument<AttendanceData> }>> =>
  axios.put<{ attendance?: HydratedDocument<AttendanceData> }>(
    `/api/attendances/${id.toString()}`,
    attendanceData
  );

export const deleteAttendance = (id: Types.ObjectId): Promise<AxiosResponse> =>
  axios.delete(`/api/attendances/${id.toString()}`);

export const getAttendanceStatistics = (
  eventId?: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
): Promise<
  AxiosResponse<{
    statistics: { num: number; users: Types.ObjectId[]; minutes: number }[];
  }>
> =>
  axios.get<{
    statistics: { num: number; users: Types.ObjectId[]; minutes: number }[];
  }>(`/api/attendances/statistics`, {
    params: { eventIdString: eventId, startDate, endDate },
  });
