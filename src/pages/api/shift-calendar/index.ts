import { isValidObjectId, Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getEvents } from "../../../../server/actions/events";
import dbConnect from "../../../../server/mongodb";
import Registration from "../../../../server/mongodb/models/Registration";
import User from "../../../../server/mongodb/models/User";
import { isAdmin } from "../../../utils/routeProtection";
import { authOptions } from "../auth/[...nextauth]";

const DAY_MS = 24 * 60 * 60 * 1000;

// Event.date is stored as UTC midnight of the calendar day, so days are UTC dates.
const parseDay = (value: unknown): Date | null => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    return null;
  return date;
};

type Shift = {
  eventId: string;
  title: string;
  startTime: string;
  endTime: string;
  maxVolunteers: number;
  filled: number;
  open: number;
  minorsCount: number;
  volunteers: string[];
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ message: "Unauthorized" });
  if (!(await isAdmin(req, res)))
    return res.status(403).json({ message: "Forbidden" });

  // Org comes from the login, never from the URL
  const sessionOrgId = (
    session.user as { organizationId?: string | Types.ObjectId }
  ).organizationId;
  if (!sessionOrgId || !isValidObjectId(String(sessionOrgId)))
    return res.status(403).json({ message: "Forbidden" });
  const organizationId = new Types.ObjectId(String(sessionOrgId));

  const weekStart = parseDay(req.query.weekStart);
  if (!weekStart)
    return res
      .status(400)
      .json({ message: "weekStart must be a date like 2026-11-22" });
  const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS - 1);

  const events = await getEvents(organizationId, weekStart, weekEnd);

  const registrations = await Registration.find({
    eventId: { $in: events.map((e) => e._id) },
    approved: "approved",
  }).lean();

  const userIds = Array.from(
    new Set(registrations.map((r) => r.userId.toString()))
  );
  // Only names leave the server: no email, phone, address or hash
  const users = await User.find(
    { _id: { $in: userIds } },
    "firstName lastName"
  ).lean();
  const nameById = new Map(
    users.map((u) => [u._id.toString(), `${u.firstName} ${u.lastName}`.trim()])
  );

  const days = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(weekStart.getTime() + i * DAY_MS).toISOString().slice(0, 10),
    shifts: [] as Shift[],
  }));

  for (const event of events) {
    const day = days.find(
      (d) => d.date === new Date(event.date).toISOString().slice(0, 10)
    );
    if (!day) continue;

    let filled = 0;
    let minorsCount = 0;
    const volunteers: string[] = [];
    for (const reg of registrations) {
      if (reg.eventId.toString() !== event._id.toString()) continue;
      // Same rule as EventCard: each approved sign-up counts 1 + its minors
      filled += 1 + reg.minors.length;
      minorsCount += reg.minors.length;
      const name = nameById.get(reg.userId.toString());
      if (name) volunteers.push(name);
    }
    volunteers.sort((a, b) => a.localeCompare(b));

    day.shifts.push({
      eventId: event._id.toString(),
      title: event.eventParent.title,
      startTime: event.eventParent.startTime,
      endTime: event.eventParent.endTime,
      maxVolunteers: event.eventParent.maxVolunteers,
      filled,
      open: Math.max(event.eventParent.maxVolunteers - filled, 0),
      minorsCount,
      volunteers,
    });
  }

  for (const day of days)
    day.shifts.sort((a, b) => a.startTime.localeCompare(b.startTime));

  return res.status(200).json({ weekStart: days[0].date, days });
};
