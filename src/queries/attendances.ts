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
// End of helper functions

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
): Promise<AxiosResponse<{ attendanceId: Types.ObjectId }>> =>
  axios.post<{ attendanceId: Types.ObjectId }>(
    "/api/attendances",
    attendanceData
  );

export const updateAttendance = (
  id: Types.ObjectId,
  attendanceData: Partial<AttendanceData>
): Promise<AxiosResponse<{ attendanceId?: Types.ObjectId }>> =>
  axios.put<{ attendanceId?: Types.ObjectId }>(
    `/api/attendances/${id.toString()}`,
    attendanceData
  );

export const deleteAttendance = (
  id: Types.ObjectId
): Promise<AxiosResponse<{ attendanceId?: Types.ObjectId }>> =>
  axios.delete<{ attendanceId?: Types.ObjectId }>(
    `/api/attendances/${id.toString()}`
  );
