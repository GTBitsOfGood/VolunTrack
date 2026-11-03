import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getShiftDateTimes } from "../../utils/dates";
import {
  getAttendanceIssue,
  getNoShowVolunteerIds,
} from "../../utils/attendance";
import { registrationNoShowServerValidator } from "../mongodb/models/Registration/validators";
import { AttendanceCorrectionError } from "./attendanceCorrections";
import type {
  CorrectionDependencies,
  CorrectionHistory,
  CorrectionStore,
  CorrectionActor,
} from "./attendanceCorrections";

export type ReviewShift = {
  _id: string;
  organizationId: string;
  title: string;
  date: Date | string;
  startTime: string;
  endTime: string;
};
export type ReviewRegistration = {
  _id: string;
  eventId: string;
  userId: string;
  organizationId: string;
  approved: string;
  noShow?: boolean;
};
export type ReviewAttendance = {
  userId: string;
  eventId: string;
  organizationId: string;
  checkinTime: Date | string | null;
  checkoutTime: Date | string | null;
};
export type ReviewData = {
  shifts: ReviewShift[];
  registrations: ReviewRegistration[];
  attendances: ReviewAttendance[];
};
export type AttendanceReviewSummary = {
  eventId: string;
  title: string;
  date: string;
  missingCheckinCount: number;
  missingCheckoutCount: number;
};
export type NoShowStore = Pick<
  CorrectionStore,
  "getVolunteer" | "lockShift" | "hasAttendance" | "writeHistory"
> & {
  getRegistration: (id: string) => Promise<ReviewRegistration | null>;
  getShift: (id: string) => Promise<ReviewShift | null>;
  markNoShow: (
    previous: ReviewRegistration
  ) => Promise<ReviewRegistration | null>;
};
export type NoShowDependencies = {
  getUser: CorrectionDependencies["getUser"];
  transaction: <T>(work: (store: NoShowStore) => Promise<T>) => Promise<T>;
  now: () => Date;
};
export type AttendanceReviewDependencies = {
  getUser: CorrectionDependencies["getUser"];
  loadReview: (organizationId: string, now: Date) => Promise<ReviewData>;
  now: () => Date;
};
const occurrenceDate = (date: Date | string) =>
  (date instanceof Date ? date.toISOString() : date).slice(0, 10);
const scopeKey = (eventId: string, userId: string) => `${eventId}:${userId}`;

export const computeAttendanceReview = (
  organizationId: string,
  data: ReviewData,
  now: Date
): AttendanceReviewSummary[] => {
  const registrationsByEvent = new Map<string, ReviewRegistration[]>();
  for (const registration of data.registrations) {
    if (
      registration.organizationId !== organizationId ||
      registration.approved !== "approved"
    )
      continue;
    const group = registrationsByEvent.get(registration.eventId) ?? [];
    group.push(registration);
    registrationsByEvent.set(registration.eventId, group);
  }
  const attendanceByVolunteer = new Map<string, ReviewAttendance[]>();
  for (const attendance of data.attendances) {
    if (attendance.organizationId !== organizationId) continue;
    const key = scopeKey(attendance.eventId, attendance.userId);
    const group = attendanceByVolunteer.get(key) ?? [];
    group.push(attendance);
    attendanceByVolunteer.set(key, group);
  }
  const summaries: AttendanceReviewSummary[] = [];
  for (const shift of data.shifts) {
    if (shift.organizationId !== organizationId) continue;
    const { end } = getShiftDateTimes(
      shift.date,
      shift.startTime,
      shift.endTime
    );
    if (!(now > end)) continue;
    const registrations = registrationsByEvent.get(shift._id) ?? [];
    const noShowIds = getNoShowVolunteerIds(registrations);
    const volunteerIds = new Set(
      registrations.map((registration) => registration.userId)
    );
    let missingCheckinCount = 0;
    let missingCheckoutCount = 0;
    for (const userId of volunteerIds) {
      const issue = getAttendanceIssue({
        approved: "approved",
        noShow: noShowIds.has(userId),
        attendances:
          attendanceByVolunteer.get(scopeKey(shift._id, userId)) ?? [],
        shiftEnd: end,
        now,
      });
      if (issue === "missingCheckin") missingCheckinCount++;
      if (issue === "missingCheckout") missingCheckoutCount++;
    }
    if (missingCheckinCount || missingCheckoutCount) {
      summaries.push({
        eventId: shift._id,
        title: shift.title,
        date: occurrenceDate(shift.date),
        missingCheckinCount,
        missingCheckoutCount,
      });
    }
  }
  return summaries.sort(
    (a, b) => a.date.localeCompare(b.date) || a.eventId.localeCompare(b.eventId)
  );
};

const noShowHistory = (
  actor: CorrectionActor,
  previous: ReviewRegistration,
  shift: ReviewShift,
  volunteerName: string
): CorrectionHistory => ({
  keyword: "EDITED",
  userId: actor._id,
  organizationId: previous.organizationId,
  eventId: previous.eventId,
  description: `${actor.firstName} ${actor.lastName} (${
    actor._id
  }) marked "Didn't come" for ${volunteerName} (${previous.userId}) at ${
    shift.title
  } (${shift._id}), ${occurrenceDate(shift.date)} ${shift.startTime}–${
    shift.endTime
  } America/New_York; registration ${previous._id}`,
});

const respondToError = (
  res: NextApiResponse,
  error: unknown,
  fallback: string
) => {
  if (error instanceof AttendanceCorrectionError)
    return res.status(error.status).json({ error: error.message });
  if (error instanceof RangeError)
    return res.status(422).json({
      error:
        "A shift has invalid or ambiguous Atlanta times. Contact an administrator.",
    });
  return res.status(500).json({ error: fallback });
};
const id = z.string().regex(/^[a-fA-F0-9]{24}$/);

export const createNoShowHandler =
  (dependencies: NoShowDependencies) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "PATCH");
      return res.status(405).json({ error: "Method not allowed." });
    }
    try {
      const actor = await dependencies.getUser(req, res);
      if (!actor)
        return res.status(401).json({ error: "Please sign in to continue." });
      if (actor.role !== "admin" || !actor.organizationId)
        return res
          .status(403)
          .json({ error: "Only organization admins can mark a no-show." });
      const query = z.object({ id }).strict().safeParse(req.query);
      const input = registrationNoShowServerValidator.safeParse(req.body);
      if (!query.success || !input.success)
        return res.status(400).json({
          error: "Provide a valid registration ID and only { noShow: true }.",
        });
      const now = dependencies.now();
      const saved = await dependencies.transaction(async (store) => {
        const previous = await store.getRegistration(query.data.id);
        if (!previous)
          throw new AttendanceCorrectionError(404, "Registration not found.");
        if (previous.organizationId !== actor.organizationId)
          throw new AttendanceCorrectionError(
            403,
            "Registration does not belong to your organization."
          );
        const shift = await store.getShift(previous.eventId);
        const volunteer = await store.getVolunteer(previous.userId);
        if (!shift || !volunteer)
          throw new AttendanceCorrectionError(
            404,
            "Shift or volunteer not found."
          );
        if (
          shift.organizationId !== actor.organizationId ||
          volunteer.organizationId !== actor.organizationId
        )
          throw new AttendanceCorrectionError(
            403,
            "Shift and volunteer must belong to your organization."
          );
        if (previous.approved !== "approved")
          throw new AttendanceCorrectionError(
            409,
            "Only an approved registration can be marked as a no-show."
          );
        const { end } = getShiftDateTimes(
          shift.date,
          shift.startTime,
          shift.endTime
        );
        if (!(now > end))
          throw new AttendanceCorrectionError(
            409,
            "Wait until after the shift's scheduled Atlanta end to mark a no-show."
          );
        // The same write lock is used by every attendance creation path.
        await store.lockShift(shift._id);
        if (await store.hasAttendance(previous.userId, previous.eventId))
          throw new AttendanceCorrectionError(
            409,
            "Attendance has been recorded. Refresh and review the punches instead."
          );
        if (previous.noShow === true) return previous;
        const updated = await store.markNoShow(previous);
        if (!updated)
          throw new AttendanceCorrectionError(
            409,
            "Registration changed. Refresh and try again."
          );
        await store.writeHistory(
          noShowHistory(
            actor,
            previous,
            shift,
            `${volunteer.firstName} ${volunteer.lastName}`
          )
        );
        return updated;
      });
      return res.status(200).json({ registration: saved });
    } catch (error) {
      return respondToError(
        res,
        error,
        "No-show decision was not saved. Refresh and try again."
      );
    }
  };

export const createAttendanceReviewHandler =
  (dependencies: AttendanceReviewDependencies) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed." });
    }
    try {
      const actor = await dependencies.getUser(req, res);
      if (!actor)
        return res.status(401).json({ error: "Please sign in to continue." });
      if (actor.role !== "admin" || !actor.organizationId)
        return res
          .status(403)
          .json({ error: "Only organization admins can review attendance." });
      if (!z.object({}).strict().safeParse(req.query).success)
        return res.status(400).json({
          error: "This endpoint accepts no organization override or filters.",
        });
      const now = dependencies.now();
      const data = await dependencies.loadReview(actor.organizationId, now);
      return res.status(200).json({
        shifts: computeAttendanceReview(actor.organizationId, data, now),
      });
    } catch (error) {
      return respondToError(
        res,
        error,
        "Attendance reminders could not be loaded. Please try again."
      );
    }
  };
