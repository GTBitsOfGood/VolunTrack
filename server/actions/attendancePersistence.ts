import Attendance, {
  AttendanceDocument,
  AttendanceInputServer,
  ATTENDANCE_UNIQUE_KEY,
  ATTENDANCE_UNIQUE_INDEX,
} from "../mongodb/models/Attendance";
import type { ClockAttendance, ClockDependencies } from "./volunteerClock";
import { AttendanceIndexUnavailableError } from "./attendanceErrors";

const attendanceData = (attendance: AttendanceDocument): ClockAttendance => ({
  _id: attendance._id.toString(),
  userId: attendance.userId.toString(),
  eventId: attendance.eventId.toString(),
  organizationId: attendance.organizationId.toString(),
  eventName: attendance.eventName,
  volunteerName: attendance.volunteerName,
  volunteerEmail: attendance.volunteerEmail,
  checkinTime: attendance.checkinTime,
  checkoutTime: attendance.checkoutTime,
  minutes: attendance.minutes,
});

export const createAttendanceOnce = async (
  input: AttendanceInputServer | Omit<ClockAttendance, "_id">
): Promise<AttendanceDocument> => {
  try {
    await Attendance.collection.createIndex(
      ATTENDANCE_UNIQUE_KEY,
      ATTENDANCE_UNIQUE_INDEX
    );
  } catch {
    throw new AttendanceIndexUnavailableError();
  }
  return Attendance.create(input);
};

export const attendanceStore: Pick<
  ClockDependencies,
  "getAttendance" | "createAttendance" | "checkoutAttendance"
> = {
  async getAttendance(scope) {
    const attendance = await Attendance.findOne(scope);
    return attendance ? attendanceData(attendance) : null;
  },
  async createAttendance(input) {
    return attendanceData(await createAttendanceOnce(input));
  },
  async checkoutAttendance(attendance, checkoutTime, minutes) {
    const updated = await Attendance.findOneAndUpdate(
      {
        _id: attendance._id,
        userId: attendance.userId,
        eventId: attendance.eventId,
        organizationId: attendance.organizationId,
        checkinTime: attendance.checkinTime,
        checkoutTime: null,
      },
      { $set: { checkoutTime, minutes } },
      { new: true, runValidators: true }
    );
    return updated ? attendanceData(updated) : null;
  },
};
