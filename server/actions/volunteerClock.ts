import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getShiftDateTimes } from "../../utils/dates";
import {
  AttendanceIndexUnavailableError,
  isDuplicateAttendanceError,
} from "./attendanceErrors";

export type ClockAction = "clock-in" | "clock-out" | "status";
export type ClockScope = {
  userId: string;
  eventId: string;
  organizationId: string;
};
export type ClockUser = {
  _id: string;
  organizationId?: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type ClockShift = {
  _id: string;
  organizationId: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
};
export type ClockAttendance = ClockScope & {
  _id: string;
  eventName: string;
  volunteerName: string;
  volunteerEmail: string;
  checkinTime: Date | null;
  checkoutTime: Date | null;
  minutes: number;
};

export type ClockDependencies = {
  getUser: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<ClockUser | null>;
  connect: () => Promise<void>;
  getShift: (eventId: string) => Promise<ClockShift | null>;
  getRegistration: (scope: ClockScope) => Promise<{ approved: string } | null>;
  getAttendance: (scope: ClockScope) => Promise<ClockAttendance | null>;
  createAttendance: (
    input: Omit<ClockAttendance, "_id">
  ) => Promise<ClockAttendance>;
  checkoutAttendance: (
    attendance: ClockAttendance,
    checkoutTime: Date,
    minutes: number
  ) => Promise<ClockAttendance | null>;
  now: () => Date;
};

const requestValidator = z
  .object({ eventId: z.string().regex(/^[a-fA-F0-9]{24}$/) })
  .strict();

const getClockWindow = (shift: ClockShift) => {
  const { start, end } = getShiftDateTimes(
    shift.date,
    shift.startTime,
    shift.endTime
  );
  const day = getShiftDateTimes(shift.date, "00:00", "23:59");
  return {
    dayStart: day.start,
    clockInOpensAt: new Date(
      Math.max(day.start.getTime(), start.getTime() - 30 * 60 * 1000)
    ),
    clockInClosesAt: end,
    // Midnight itself belongs to the next Atlanta calendar day.
    clockOutClosesAt: new Date(day.end.getTime() + 60 * 1000),
  };
};

export const createVolunteerClockHandler =
  (action: ClockAction, dependencies: ClockDependencies) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    const method = action === "status" ? "GET" : "POST";
    if (req.method !== method) {
      res.setHeader("Allow", method);
      return res.status(405).json({ error: "Method not allowed." });
    }

    try {
      const user = await dependencies.getUser(req, res);
      if (!user) {
        return res.status(401).json({ error: "Please sign in to continue." });
      }

      const input = requestValidator.safeParse(
        action === "status" ? req.query : req.body
      );
      if (!input.success) {
        return res.status(400).json({
          error:
            "Provide only a valid eventId. Identity and times are set by the server.",
        });
      }
      await dependencies.connect();
      const shift = await dependencies.getShift(input.data.eventId);
      if (!shift) {
        return res.status(404).json({ error: "Shift not found." });
      }
      if (user.organizationId !== shift.organizationId) {
        return res.status(403).json({
          error: "You must belong to this shift's organization.",
        });
      }

      const scope = {
        userId: user._id,
        eventId: shift._id,
        organizationId: shift.organizationId,
      };
      const registration = await dependencies.getRegistration(scope);
      const isApproved = registration?.approved === "approved";
      if (action !== "status" && !isApproved) {
        return res.status(403).json({
          error: "An approved registration is required to clock in or out.",
        });
      }

      let window: ReturnType<typeof getClockWindow>;
      try {
        window = getClockWindow(shift);
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        return res.status(422).json({
          error:
            "This shift's times are invalid or ambiguous. Contact an admin.",
        });
      }

      const attendance = await dependencies.getAttendance(scope);
      const now = dependencies.now();
      const inClockInWindow =
        now >= window.clockInOpensAt && now <= window.clockInClosesAt;
      const inCheckoutWindow =
        now >= window.dayStart && now < window.clockOutClosesAt;
      const hasOpenAttendance =
        attendance !== null &&
        attendance.checkoutTime === null &&
        attendance.checkinTime !== null &&
        Number.isFinite(attendance.checkinTime.getTime()) &&
        attendance.checkinTime <= now;

      if (action === "status") {
        return res.status(200).json({
          attendance,
          serverTime: now,
          clockInOpensAt: window.clockInOpensAt,
          clockInClosesAt: window.clockInClosesAt,
          clockOutClosesAt: window.clockOutClosesAt,
          isApproved,
          canClockIn: isApproved && !attendance && inClockInWindow,
          canClockOut: isApproved && hasOpenAttendance && inCheckoutWindow,
        });
      }

      if (action === "clock-in") {
        if (attendance) {
          return res.status(409).json({
            error: "You already have attendance for this shift.",
          });
        }
        if (!inClockInWindow) {
          return res.status(403).json({
            error:
              "Clock-in is available on the shift day from 30 minutes before it starts until it ends.",
          });
        }
        const created = await dependencies.createAttendance({
          ...scope,
          eventName: shift.title,
          volunteerName: `${user.firstName} ${user.lastName}`,
          volunteerEmail: user.email,
          checkinTime: now,
          checkoutTime: null,
          minutes: 0,
        });
        return res.status(201).json({ attendance: created, serverTime: now });
      }

      if (!hasOpenAttendance || !attendance.checkinTime) {
        return res.status(409).json({
          error: "You must have an open, valid check-in before clocking out.",
        });
      }
      if (!inCheckoutWindow) {
        return res.status(403).json({
          error:
            "Volunteer checkout closes at midnight Atlanta time on the shift day. Contact an admin.",
        });
      }
      const minutes = Math.round(
        (now.getTime() - attendance.checkinTime.getTime()) / (60 * 1000)
      );
      const updated = await dependencies.checkoutAttendance(
        attendance,
        now,
        minutes
      );
      if (!updated) {
        return res.status(409).json({
          error:
            "Attendance changed while checking out. Refresh and try again.",
        });
      }
      return res.status(200).json({ attendance: updated, serverTime: now });
    } catch (error) {
      if (error instanceof AttendanceIndexUnavailableError) {
        return res.status(503).json({
          error: "Check-in is temporarily unavailable. Contact an admin.",
        });
      }
      if (isDuplicateAttendanceError(error)) {
        return res.status(409).json({
          error: "You already have attendance for this shift.",
        });
      }
      return res.status(500).json({
        error: "Unable to update or load attendance. Please try again.",
      });
    }
  };
