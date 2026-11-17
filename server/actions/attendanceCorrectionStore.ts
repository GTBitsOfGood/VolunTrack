import { createHash } from "crypto";
import mongoose, { ClientSession, Types } from "mongoose";
import Attendance, { AttendanceDocument } from "../mongodb/models/Attendance";
import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import User from "../mongodb/models/User";
import HistoryEvent from "../mongodb/models/HistoryEvent";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import { isDuplicateAttendanceError as isDuplicateKey } from "./attendanceErrors";
import type {
  CorrectionAttendance,
  CorrectionStore,
} from "./attendanceCorrections";

// The one lookup for a shift: its event plus the parent that holds the title,
// times and organization. Every attendance flow uses this.
export const findShift = async (id: string, session?: ClientSession) => {
  const event = await Event.findById(id).session(session ?? null);
  if (!event) return null;
  const parent = await EventParent.findById(event.eventParent).session(
    session ?? null
  );
  if (!parent) return null;
  return {
    _id: event._id.toString(),
    organizationId: parent.organizationId.toString(),
    title: parent.title,
    date: event.date,
    startTime: parent.startTime,
    endTime: parent.endTime,
    isEnded: event.isEnded,
  };
};

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

// The live site's database, Azure Cosmos DB for MongoDB (RU), cannot run one
// transaction across collections, so attendance is saved one step at a time
// there. Its vCore edition (mongocluster.cosmos.azure.com) can run one, and is
// not matched.
const COSMOS_RU_ADDRESS =
  /\.(mongo\.cosmos|documents)\.azure\.com(?=[:/,?]|$)/i;
export const isCosmosRuAddress = (address?: string): boolean =>
  !!address && COSMOS_RU_ADDRESS.test(address);

// ATTENDANCE_TRANSACTIONS=off picks the same path on any database: to test it
// locally, or in case the address check ever misses the live database.
export const savesWithoutTransaction = (): boolean =>
  process.env.ATTENDANCE_TRANSACTIONS === "off" ||
  isCosmosRuAddress(process.env.MONGO_DB) ||
  isCosmosRuAddress(mongoose.connection.host);

// Without a transaction the shift lock cannot stop two requests from both
// saving. A fixed _id for each volunteer and shift makes the database itself
// refuse the second one, because _id is unique on every database.
export const volunteerShiftId = (userId: string, eventId: string) =>
  new Types.ObjectId(
    createHash("sha256")
      .update(`${userId}:${eventId}`.toLowerCase())
      .digest("hex")
      .slice(0, 24)
  );

const HISTORY_ATTEMPTS = 3;

// With a session, every read and write joins that transaction. Without one
// (Azure Cosmos DB), each step is saved on its own.
export const createCorrectionStore = (
  session?: ClientSession
): CorrectionStore => ({
  getShift: (id) => findShift(id, session),
  async getVolunteer(id) {
    const user = await User.findById(id).session(session ?? null);
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
    const attendance = await Attendance.findById(id).session(session ?? null);
    return attendance ? attendanceData(attendance) : null;
  },
  async lockShift(id) {
    // A real write serializes all creates for this shift inside transactions.
    // Unlike a unique user/event index, this preserves legacy multi-record data.
    // Without a transaction it only confirms the shift exists; the fixed _id
    // in create() does the serializing.
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
      (await Attendance.exists({ userId, eventId }).session(
        session ?? null
      )) !== null
    );
  },
  async create(input) {
    if (session) {
      const [attendance] = await Attendance.create([input], { session });
      return attendanceData(attendance);
    }
    try {
      const [attendance] = await Attendance.create([
        { ...input, _id: volunteerShiftId(input.userId, input.eventId) },
      ]);
      return attendanceData(attendance);
    } catch (error) {
      if (!isDuplicateKey(error)) throw error;
      throw new AttendanceCorrectionError(
        409,
        "Attendance already exists for this volunteer and shift."
      );
    }
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
    if (session) {
      await HistoryEvent.create([input], { session });
      return;
    }
    // The change itself is already saved, so try its history line again
    // before giving up. One _id for every try keeps a retry from saving the
    // line twice.
    const _id = new Types.ObjectId();
    for (let attempt = 1; ; attempt++) {
      try {
        await HistoryEvent.create([{ ...input, _id }]);
        return;
      } catch (error) {
        if (isDuplicateKey(error)) return;
        if (attempt === HISTORY_ATTEMPTS) {
          // The server log is then the only record of this change.
          // eslint-disable-next-line no-console
          console.error("Attendance history line not saved:", input);
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
      }
    }
  },
});

// Expects the normal application connection (or an explicitly isolated test DB).
// Standalone MongoDB must fail closed: no unaudited fallback write is permitted.
// Azure Cosmos DB is the one exception, because the live site runs on it: the
// same steps run there without a transaction (see createCorrectionStore).
export const withAttendanceTransaction = async <T>(
  work: (store: CorrectionStore, session?: ClientSession) => Promise<T>
): Promise<T> => {
  if (savesWithoutTransaction()) return work(createCorrectionStore());
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
