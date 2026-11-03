import Registration from "../mongodb/models/Registration";
import { getClockWindow } from "./volunteerClock";
import Attendance from "../mongodb/models/Attendance";
import type { ClockDependencies } from "./volunteerClock";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import {
  attendanceData,
  runAttendanceTransaction,
  withAttendanceTransaction,
} from "./attendanceCorrectionStore";

export const attendanceStore: Pick<
  ClockDependencies,
  "getAttendance" | "createAttendance" | "checkoutAttendance"
> = {
  async getAttendance(scope) {
    const attendances = await Attendance.find(scope).sort({
      checkinTime: -1,
      _id: -1,
    });
    const open = attendances.filter(
      (attendance) => attendance.checkinTime && !attendance.checkoutTime
    );
    if (open.length > 1) {
      throw new AttendanceCorrectionError(
        409,
        "Multiple open attendance records need admin review."
      );
    }
    const attendance = open.at(0) ?? attendances.at(0);
    return attendance ? attendanceData(attendance) : null;
  },
  async createAttendance(input) {
    return runAttendanceTransaction(async (store) => {
      await store.lockShift(input.eventId);
      if (await store.hasAttendance(input.userId, input.eventId)) {
        throw new AttendanceCorrectionError(
          409,
          "You already have attendance for this shift."
        );
      }
      return store.create(input);
    });
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

// The public day-of flow remains a live punch, never a historical correction.
// Its registration and attendance participate in the same creation lock.
export const createWalkInAttendance = async (
  shift: import("./volunteerClock").ClockShift,
  user: import("./volunteerClock").ClockUser,
  now: Date
) => {
  if (user.organizationId !== shift.organizationId) {
    throw new AttendanceCorrectionError(
      403,
      "Volunteer and shift must belong to the same organization."
    );
  }
  const window = getClockWindow(shift);
  if (now < window.clockInOpensAt || now > window.clockInClosesAt) {
    throw new AttendanceCorrectionError(
      403,
      "Day-of check-in is available only during the shift's Atlanta check-in window."
    );
  }
  const scope = {
    userId: user._id,
    eventId: shift._id,
    organizationId: shift.organizationId,
  };
  return withAttendanceTransaction(async (store, session) => {
    await store.lockShift(shift._id);
    if (await store.hasAttendance(user._id, shift._id)) {
      throw new AttendanceCorrectionError(
        409,
        "Attendance already exists for this volunteer and shift."
      );
    }
    const registration = await Registration.findOne(scope).session(session);
    if (registration && registration.approved !== "approved") {
      throw new AttendanceCorrectionError(
        403,
        "An approved registration is required to check in."
      );
    }
    if (!registration) await Registration.create([scope], { session });
    return store.create({
      ...scope,
      eventName: shift.title,
      volunteerName: `${user.firstName} ${user.lastName}`,
      volunteerEmail: user.email,
      checkinTime: now,
      checkoutTime: null,
      minutes: 0,
    });
  });
};
