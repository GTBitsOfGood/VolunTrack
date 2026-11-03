import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import Attendance from "../mongodb/models/Attendance";
import { withAttendanceTransaction } from "./attendanceCorrectionStore";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import type { EventStatusStore } from "./attendanceEventStatus";
export const runEventStatusTransaction = <T>(
  work: (store: EventStatusStore) => Promise<T>
): Promise<T> =>
  withAttendanceTransaction(async (base, session) =>
    work({
      lockShift: base.lockShift,
      writeHistory: base.writeHistory,
      async getShift(id) {
        const event = await Event.findById(id).session(session);
        if (!event) return null;
        const parent = await EventParent.findById(event.eventParent).session(
          session
        );
        return parent
          ? {
              _id: String(event._id),
              organizationId: String(parent.organizationId),
              title: parent.title,
              date: event.date,
              isEnded: event.isEnded,
            }
          : null;
      },
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
