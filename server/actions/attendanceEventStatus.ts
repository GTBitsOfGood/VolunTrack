import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import {
  AttendanceCorrectionError,
  CorrectionDependencies,
  CorrectionHistory,
} from "./attendanceCorrections";
export type EventStatusShift = {
  _id: string;
  organizationId: string;
  title: string;
  date: Date | string;
  isEnded: boolean;
};
export type EventStatusStore = {
  lockShift(id: string): Promise<void>;
  getShift(id: string): Promise<EventStatusShift | null>;
  hasOpenAttendance(id: string, organizationId: string): Promise<boolean>;
  setEnded(
    id: string,
    isEnded: boolean
  ): Promise<{ _id: string; isEnded: boolean }>;
  writeHistory(history: CorrectionHistory): Promise<void>;
};
type Dependencies = {
  getUser: CorrectionDependencies["getUser"];
  transaction: <T>(work: (store: EventStatusStore) => Promise<T>) => Promise<T>;
};
export const createAttendanceEventStatusHandler =
  (deps: Dependencies) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (req.method !== "PATCH")
        return res.status(405).json({ error: "Method not allowed." });
      const actor = await deps.getUser(req, res);
      if (!actor)
        return res.status(401).json({ error: "Sign in to manage attendance." });
      if (actor.role !== "admin" || !actor.organizationId)
        return res
          .status(403)
          .json({ error: "Only organization admins can manage attendance." });
      const id = z
        .string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .safeParse(req.query.id);
      const body = z
        .object({ isEnded: z.boolean() })
        .strict()
        .safeParse(req.body);
      if (!id.success || !body.success)
        return res
          .status(400)
          .json({ error: "Provide a shift ID and only an isEnded boolean." });
      const event = await deps.transaction(async (store) => {
        const shift = await store.getShift(id.data);
        if (!shift)
          throw new AttendanceCorrectionError(404, "Shift not found.");
        if (shift.organizationId !== actor.organizationId)
          throw new AttendanceCorrectionError(
            403,
            "Shift belongs to another organization."
          );
        await store.lockShift(id.data);
        if (
          body.data.isEnded &&
          (await store.hasOpenAttendance(id.data, shift.organizationId))
        )
          throw new AttendanceCorrectionError(
            409,
            "Attendance changed. Check out remaining open entries before ending the event."
          );
        if (shift.isEnded === body.data.isEnded)
          return { _id: shift._id, isEnded: shift.isEnded };
        const saved = await store.setEnded(id.data, body.data.isEnded);
        await store.writeHistory({
          keyword: "EDITED",
          userId: actor._id,
          organizationId: shift.organizationId,
          eventId: shift._id,
          description: `${actor.firstName} ${actor.lastName} ${
            saved.isEnded ? "ended" : "reopened"
          } ${shift.title} (${new Date(shift.date)
            .toISOString()
            .slice(0, 10)}, America/New_York).`,
        });
        return saved;
      });
      return res.status(200).json({ event });
    } catch (error) {
      return res
        .status(error instanceof AttendanceCorrectionError ? error.status : 500)
        .json({
          error:
            error instanceof AttendanceCorrectionError
              ? error.message
              : "Unable to update event attendance status.",
        });
    }
  };
