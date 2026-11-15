import Event from "../mongodb/models/Event";
import Attendance from "../mongodb/models/Attendance";
import {
  findShift,
  withAttendanceTransaction,
} from "./attendanceCorrectionStore";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import type { EventStatusStore } from "./attendanceEventStatus";
export const runEventStatusTransaction = <T>(
  work: (store: EventStatusStore) => Promise<T>
): Promise<T> =>
  withAttendanceTransaction(async (base, session) =>
    work({
      lockShift: base.lockShift,
      writeHistory: base.writeHistory,
      getShift: (id) => findShift(id, session),
      async hasOpenAttendance(eventId, organizationId) {
        return !!(await Attendance.exists({
          eventId,
          organizationId,
          checkinTime: { $ne: null },
          checkoutTime: null,
        }).session(session));
      },
      async setEnded(id, isEnded) {
        const event = await Event.findByIdAndUpdate(
          id,
          { $set: { isEnded } },
          { new: true, session, runValidators: true }
        );
        if (!event)
          throw new AttendanceCorrectionError(404, "Shift not found.");
        return { _id: String(event._id), isEnded: event.isEnded };
      },
    })
  );
