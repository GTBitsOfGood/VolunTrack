import axios, { AxiosResponse } from "axios";
import { HydratedDocument, Types } from "mongoose";
import { AttendanceData } from "../../server/mongodb/models/Attendance";

export const getAttendancesByUserId = (
  userId: Types.ObjectId
): Promise<
  AxiosResponse<{ attendances: HydratedDocument<AttendanceData>[] }>
> =>
  axios.get<{ attendances: HydratedDocument<AttendanceData>[] }>(
    "/api/attendances",
    {
      params: { userId },
    }
  );

export const createAttendance = (
  eventId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<AxiosResponse<{ attendanceId: Types.ObjectId }>> =>
  axios.post<{ attendanceId: Types.ObjectId }>("/api/attendances", {
    eventId,
    userId,
  });
