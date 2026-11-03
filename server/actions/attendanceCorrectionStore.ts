import mongoose, { ClientSession } from "mongoose";
import Attendance, { AttendanceDocument } from "../mongodb/models/Attendance";
import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import User from "../mongodb/models/User";
import HistoryEvent from "../mongodb/models/HistoryEvent";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import type {
  CorrectionAttendance,
  CorrectionDependencies,
  CorrectionStore,
} from "./attendanceCorrections";

export const attendanceData = (
  attendance: AttendanceDocument
): CorrectionAttendance => ({
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

export const createCorrectionStore = (
  session: ClientSession
): CorrectionStore => ({
  async getShift(id) {
    const event = await Event.findById(id).session(session);
    if (!event) return null;
    const parent = await EventParent.findById(event.eventParent).session(
      session
    );
    return parent
      ? {
          _id: event._id.toString(),
          organizationId: parent.organizationId.toString(),
          title: parent.title,
        }
      : null;
  },
  async getVolunteer(id) {
    const user = await User.findById(id).session(session);
    return user
      ? {
          _id: user._id.toString(),
          organizationId: user.organizationId?.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      : null;
  },
  async getAttendance(id) {
    const attendance = await Attendance.findById(id).session(session);
    return attendance ? attendanceData(attendance) : null;
  },
  async lockShift(id) {
    // A real write serializes all creates for this shift inside transactions.
    // Unlike a unique user/event index, this preserves legacy multi-record data.
    const result = await Event.updateOne(
      { _id: id },
      { $inc: { attendanceWriteVersion: 1 } },
      { session, timestamps: false }
    );
    if (result.matchedCount !== 1)
      throw new AttendanceCorrectionError(404, "Shift not found.");
  },
  async hasAttendance(userId, eventId) {
    return (
      (await Attendance.exists({ userId, eventId }).session(session)) !== null
    );
  },
  async create(input) {
    const [attendance] = await Attendance.create([input], { session });
    return attendanceData(attendance);
  },
  async update(previous, punches) {
    const saved = await Attendance.findOneAndUpdate(
      {
        _id: previous._id,
        userId: previous.userId,
        eventId: previous.eventId,
        organizationId: previous.organizationId,
        checkinTime: previous.checkinTime,
        checkoutTime: previous.checkoutTime,
      },
      { $set: punches },
      { session, new: true, runValidators: true }
    );
    return saved ? attendanceData(saved) : null;
  },
  async writeHistory(input) {
    await HistoryEvent.create([input], { session });
  },
});

// Expects the normal application connection (or an explicitly isolated test DB).
// Standalone MongoDB must fail closed: no unaudited fallback write is permitted.
export const withAttendanceTransaction = async <T>(
  work: (store: CorrectionStore, session: ClientSession) => Promise<T>
): Promise<T> => {
  const topology = (await mongoose.connection.db
    .admin()
    .command({ hello: 1 })) as {
    setName?: string;
    msg?: string;
    logicalSessionTimeoutMinutes?: number;
  };
  if (
    (!topology.setName && topology.msg !== "isdbgrid") ||
    topology.logicalSessionTimeoutMinutes == null
  ) {
    throw new AttendanceCorrectionError(
      503,
      "Attendance corrections require MongoDB transaction support. Contact an administrator."
    );
  }
  const session = await mongoose.startSession();
  try {
    let saved!: T;
    await session.withTransaction(
      async () => {
        saved = await work(createCorrectionStore(session), session);
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary",
      }
    );
    return saved;
  } finally {
    await session.endSession();
  }
};

export const runAttendanceTransaction: CorrectionDependencies["transaction"] =
  withAttendanceTransaction;
