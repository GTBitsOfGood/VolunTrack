import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { buildAttendanceCorrectionHistory } from "./attendanceHistory";

export type CorrectionActor = {
  _id: string;
  organizationId?: string;
  role: string;
  firstName: string;
  lastName: string;
};
export type CorrectionAttendance = {
  _id: string;
  userId: string;
  eventId: string;
  organizationId: string;
  eventName: string;
  volunteerName: string;
  volunteerEmail: string;
  checkinTime: Date | null;
  checkoutTime: Date | null;
  minutes: number;
};
export type CorrectionShift = {
  _id: string;
  organizationId: string;
  title: string;
};
export type CorrectionVolunteer = {
  _id: string;
  organizationId?: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type CorrectionHistory = {
  keyword: string;
  description: string;
  userId: string;
  organizationId: string;
  eventId: string;
};
export type CorrectionPunches = Pick<
  CorrectionAttendance,
  "checkinTime" | "checkoutTime" | "minutes"
>;
export type CorrectionStore = {
  getShift: (id: string) => Promise<CorrectionShift | null>;
  getVolunteer: (id: string) => Promise<CorrectionVolunteer | null>;
  getAttendance: (id: string) => Promise<CorrectionAttendance | null>;
  lockShift: (id: string) => Promise<void>;
  hasAttendance: (userId: string, eventId: string) => Promise<boolean>;
  create: (
    input: Omit<CorrectionAttendance, "_id">
  ) => Promise<CorrectionAttendance>;
  update: (
    previous: CorrectionAttendance,
    punches: CorrectionPunches
  ) => Promise<CorrectionAttendance | null>;
  writeHistory: (input: CorrectionHistory) => Promise<void>;
};
export type CorrectionDependencies = {
  getUser: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<CorrectionActor | null>;
  transaction: <T>(work: (store: CorrectionStore) => Promise<T>) => Promise<T>;
};

export class AttendanceCorrectionError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "AttendanceCorrectionError";
  }
}

const id = z.string().regex(/^[a-fA-F0-9]{24}$/);
const instant = z
  .string()
  .datetime()
  .refine((value) => {
    const date = new Date(value);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().startsWith(value.slice(0, 19))
    );
  }, "Invalid calendar date or time")
  .transform((value) => new Date(value));
const punches = {
  checkinTime: instant.nullable().optional(),
  checkoutTime: instant.nullable().optional(),
};
const createInput = z.object({
  userId: id,
  eventId: id,
  organizationId: id.optional(),
  ...punches,
});
const updateInput = z.object({
  userId: id.optional(),
  eventId: id.optional(),
  organizationId: id.optional(),
  ...punches,
  onlyIfOpen: z.boolean().optional(),
  expectedPunches: z
    .object({
      checkinTime: instant.nullable(),
      checkoutTime: instant.nullable(),
    })
    .strict()
    .optional(),
});
const sameTime = (a: Date | null, b: Date | null) =>
  a?.getTime() === b?.getTime();

const calculatePunches = (
  checkinTime: Date | null,
  checkoutTime: Date | null
): CorrectionPunches => {
  if (checkoutTime && (!checkinTime || checkoutTime < checkinTime)) {
    throw new AttendanceCorrectionError(
      400,
      "Checkout must be at or after a recorded check-in."
    );
  }
  return {
    checkinTime,
    checkoutTime,
    minutes:
      checkinTime && checkoutTime
        ? Math.round((checkoutTime.getTime() - checkinTime.getTime()) / 60000)
        : 0,
  };
};

export const createAttendanceCorrectionHandler =
  (action: "create" | "update", dependencies: CorrectionDependencies) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== (action === "create" ? "POST" : "PUT")) {
      res.setHeader("Allow", action === "create" ? "POST" : "PUT");
      return res.status(405).json({ error: "Method not allowed." });
    }
    try {
      const actor = await dependencies.getUser(req, res);
      if (!actor)
        return res.status(401).json({ error: "Please sign in to continue." });
      if (actor.role !== "admin" || !actor.organizationId) {
        return res
          .status(403)
          .json({ error: "Only organization admins can correct attendance." });
      }
      const parsed = (
        action === "create" ? createInput : updateInput
      ).safeParse(req.body);
      if (!parsed.success)
        return res.status(400).json({ error: parsed.error.message });
      const attendanceId =
        action === "update" ? id.safeParse(req.query.id) : null;
      if (attendanceId && !attendanceId.success) {
        return res.status(400).json({ error: "Invalid attendance ID." });
      }
      const saved = await dependencies.transaction(async (store) => {
        const previous = attendanceId?.success
          ? await store.getAttendance(attendanceId.data)
          : null;
        if (action === "update" && !previous)
          throw new AttendanceCorrectionError(404, "Attendance not found.");
        const input = parsed.data;
        if (
          previous &&
          (previous.organizationId !== actor.organizationId ||
            (input.userId && input.userId !== previous.userId) ||
            (input.eventId && input.eventId !== previous.eventId))
        ) {
          throw new AttendanceCorrectionError(
            403,
            "Attendance does not belong to the requested organization, volunteer, and shift."
          );
        }
        if (
          input.organizationId &&
          input.organizationId !== actor.organizationId
        ) {
          throw new AttendanceCorrectionError(
            403,
            "Organization override is not allowed."
          );
        }
        const eventId = previous?.eventId ?? input.eventId;
        const userId = previous?.userId ?? input.userId;
        if (!eventId || !userId)
          throw new AttendanceCorrectionError(
            400,
            "Volunteer and shift are required."
          );
        const shift = await store.getShift(eventId);
        const volunteer = await store.getVolunteer(userId);
        if (!shift || !volunteer)
          throw new AttendanceCorrectionError(
            404,
            "Volunteer or shift not found."
          );
        if (
          shift.organizationId !== actor.organizationId ||
          volunteer.organizationId !== actor.organizationId
        ) {
          throw new AttendanceCorrectionError(
            403,
            "Volunteer and shift must belong to your organization."
          );
        }
        const update = updateInput.parse(req.body);
        if (
          update.onlyIfOpen &&
          (!previous?.checkinTime || previous.checkoutTime)
        ) {
          throw new AttendanceCorrectionError(
            409,
            "Attendance is no longer open. Refresh and try again."
          );
        }
        if (
          update.expectedPunches &&
          previous &&
          (!sameTime(
            previous.checkinTime,
            update.expectedPunches.checkinTime
          ) ||
            !sameTime(
              previous.checkoutTime,
              update.expectedPunches.checkoutTime
            ))
        ) {
          throw new AttendanceCorrectionError(
            409,
            "Attendance changed since this editor opened. Close the dialog, refresh attendance, and reopen it before saving."
          );
        }
        const values = calculatePunches(
          input.checkinTime !== undefined
            ? input.checkinTime
            : previous?.checkinTime ?? null,
          input.checkoutTime !== undefined
            ? input.checkoutTime
            : previous?.checkoutTime ?? null
        );
        if (!previous && !values.checkinTime)
          throw new AttendanceCorrectionError(
            400,
            "A check-in is required to add attendance."
          );
        if (
          previous &&
          sameTime(previous.checkinTime, values.checkinTime) &&
          sameTime(previous.checkoutTime, values.checkoutTime)
        )
          return previous;
        let attendance: CorrectionAttendance;
        if (previous) {
          const updated = await store.update(previous, values);
          if (!updated)
            throw new AttendanceCorrectionError(
              409,
              "Attendance changed. Refresh and try again."
            );
          attendance = updated;
        } else {
          // Every creation path takes the same shift lock before testing absence.
          await store.lockShift(shift._id);
          if (await store.hasAttendance(userId, eventId)) {
            throw new AttendanceCorrectionError(
              409,
              "Attendance already exists for this volunteer and shift. Refresh and edit it."
            );
          }
          attendance = await store.create({
            userId: volunteer._id,
            eventId: shift._id,
            organizationId: shift.organizationId,
            volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
            volunteerEmail: volunteer.email,
            eventName: shift.title,
            ...values,
          });
        }
        await store.writeHistory(
          buildAttendanceCorrectionHistory(actor, previous, attendance)
        );
        return attendance;
      });
      return res
        .status(action === "create" ? 201 : 200)
        .json({ attendance: saved });
    } catch (error) {
      if (error instanceof AttendanceCorrectionError) {
        return res.status(error.status).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: "Attendance was not saved. Refresh and try again." });
    }
  };
