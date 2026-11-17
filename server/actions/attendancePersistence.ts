import type { ClientSession } from "mongoose";
import Registration from "../mongodb/models/Registration";
import Attendance, { AttendanceDocument } from "../mongodb/models/Attendance";
import type { ClockDependencies, ClockScope } from "./volunteerClock";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import { isDuplicateAttendanceError as isDuplicateKey } from "./attendanceErrors";
import {
  attendanceData,
  volunteerShiftId,
  withAttendanceTransaction,
} from "./attendanceCorrectionStore";

// Newest check-in first, then newest record: the order that sorting by
// { checkinTime: -1, _id: -1 } gives. A record with no check-in comes last.
const newestFirst = (a: AttendanceDocument, b: AttendanceDocument) => {
  const [aTime, bTime] = [a, b].map(
    (attendance) => attendance.checkinTime?.getTime() ?? -Infinity
  );
  if (aTime !== bTime) return aTime < bTime ? 1 : -1;
  return a._id.toString() < b._id.toString() ? 1 : -1;
};

// Without a transaction (Azure Cosmos DB), two quick scans could both add a
// sign-up. The fixed _id lets only one in; the other finds it already there
// and carries on to the attendance record.
const createWalkInRegistration = async (
  scope: ClockScope,
  session?: ClientSession
) => {
  if (session) {
    await Registration.create([scope], { session });
    return;
  }
  try {
    await Registration.create([
      { ...scope, _id: volunteerShiftId(scope.userId, scope.eventId) },
    ]);
  } catch (error) {
    if (!isDuplicateKey(error)) throw error;
  }
};

export const attendanceStore: Pick<
  ClockDependencies,
  "getAttendance" | "createAttendance" | "checkoutAttendance"
> = {
  async getAttendance(scope) {
    // Sorted here, not by the database: Azure Cosmos DB (the live site)
    // refuses a two-field sort that has no matching index. One volunteer has
    // very few records for one shift.
    const attendances = (await Attendance.find(scope)).sort(newestFirst);
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
    return withAttendanceTransaction(async (store) => {
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
// The day-of route checks the organization and the check-in window first,
// before it creates any account, so they are not repeated here.
export const createWalkInAttendance = async (
  shift: import("./volunteerClock").ClockShift,
  user: import("./volunteerClock").ClockUser,
  now: Date
) => {
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
    const registration = await Registration.findOne(scope).session(
      session ?? null
    );
    if (registration && registration.approved !== "approved") {
      throw new AttendanceCorrectionError(
        403,
        "An approved registration is required to check in."
      );
    }
    if (!registration) await createWalkInRegistration(scope, session);
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
