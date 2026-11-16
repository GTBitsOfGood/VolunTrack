import Registration, {
  RegistrationDocument,
} from "../mongodb/models/Registration";
import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import Attendance from "../mongodb/models/Attendance";
import {
  findShift,
  withAttendanceTransaction,
} from "./attendanceCorrectionStore";
import type {
  AttendanceReviewDependencies,
  NoShowDependencies,
  ReviewRegistration,
} from "./attendanceReview";

// The home-page reminder only looks back this far. Older shifts predate
// "Didn't come", so every old no-show would otherwise count as missing.
const REVIEW_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const registrationData = (
  registration: RegistrationDocument
): ReviewRegistration => ({
  ...registration.toObject(),
  _id: registration._id.toString(),
  eventId: registration.eventId.toString(),
  userId: registration.userId.toString(),
  organizationId: registration.organizationId.toString(),
  approved: registration.approved,
  noShow: registration.noShow,
});

export const runNoShowTransaction: NoShowDependencies["transaction"] = async (
  work
) =>
  withAttendanceTransaction(async (shared, session) =>
    work({
      ...shared,
      async getRegistration(id) {
        const registration = await Registration.findById(id).session(
          session ?? null
        );
        return registration ? registrationData(registration) : null;
      },
      getShift: (id) => findShift(id, session),
      async markNoShow(previous) {
        const saved = await Registration.findOneAndUpdate(
          {
            _id: previous._id,
            eventId: previous.eventId,
            userId: previous.userId,
            organizationId: previous.organizationId,
            approved: "approved",
            noShow: { $ne: true },
          },
          { $set: { noShow: true } },
          { session, new: true, runValidators: true }
        );
        return saved ? registrationData(saved) : null;
      },
    })
  );

export const loadAttendanceReview: AttendanceReviewDependencies["loadReview"] =
  async (organizationId, now) => {
    const parents = await EventParent.find({ organizationId })
      .select("title startTime endTime organizationId")
      .lean();
    if (!parents.length)
      return { shifts: [], registrations: [], attendances: [] };
    const parentById = new Map(
      parents.map((parent) => [parent._id.toString(), parent])
    );
    // Stored occurrence dates are calendar labels. Include the entire UTC date;
    // the shared Atlanta helper, not this coarse query, determines scheduled end.
    const dateCutoff = new Date(now.getTime());
    dateCutoff.setUTCHours(23, 59, 59, 999);
    const windowStart = new Date(now.getTime() - REVIEW_WINDOW_DAYS * DAY_MS);
    windowStart.setUTCHours(0, 0, 0, 0);
    const events = await Event.find({
      eventParent: { $in: parents.map((parent) => parent._id) },
      date: { $gte: windowStart, $lte: dateCutoff },
    })
      .select("date eventParent")
      .lean();
    if (!events.length)
      return { shifts: [], registrations: [], attendances: [] };
    const eventIds = events.map((event) => event._id);
    const [registrations, attendances] = await Promise.all([
      Registration.find({
        organizationId,
        eventId: { $in: eventIds },
        approved: "approved",
      })
        .select("eventId userId organizationId approved noShow")
        .lean(),
      Attendance.find({ organizationId, eventId: { $in: eventIds } })
        .select("eventId userId organizationId checkinTime checkoutTime")
        .lean(),
    ]);
    const shifts = events.flatMap((event) => {
      const parent = parentById.get(event.eventParent.toString());
      return parent
        ? [
            {
              _id: event._id.toString(),
              date: event.date,
              organizationId: parent.organizationId.toString(),
              title: parent.title,
              startTime: parent.startTime,
              endTime: parent.endTime,
            },
          ]
        : [];
    });
    return {
      shifts,
      registrations: registrations.map((registration) => ({
        _id: registration._id.toString(),
        eventId: registration.eventId.toString(),
        userId: registration.userId.toString(),
        organizationId: registration.organizationId.toString(),
        approved: registration.approved,
        noShow: registration.noShow,
      })),
      attendances: attendances.map((attendance) => ({
        eventId: attendance.eventId.toString(),
        userId: attendance.userId.toString(),
        organizationId: attendance.organizationId.toString(),
        checkinTime: attendance.checkinTime,
        checkoutTime: attendance.checkoutTime,
      })),
    };
  };
