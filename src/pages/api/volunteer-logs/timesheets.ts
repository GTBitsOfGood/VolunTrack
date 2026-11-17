import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import User from "../../../../server/mongodb/models/User";
import VolunteerLog from "../../../../server/mongodb/models/VolunteerLog";
import { formatAtlantaDate } from "../../../../utils/dates";
import { authOptions } from "../auth/[...nextauth]";

type Entry = {
  id: string;
  kind: "typed" | "clock";
  name: string;
  eventName: string;
  tasks: string[];
  date: string;
  start: Date;
  end: Date;
};

const asTasks = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((task) => String(task)) : [];

// One page of the Volunteer Timesheets list, newest first, with the search
// applied here. The page used to download every attendance record, sign-up and
// typed log of the organization and show them all at once. Sorting happens
// here, not in the database: the live site's database (Azure Cosmos DB)
// refuses to sort on fields without an index.
// GET /api/volunteer-logs/timesheets?page=0&pageSize=20&search=text
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "Sign in first" });
  if (session.user.role !== "admin")
    return res.status(403).json({ error: "Admin access required" });
  if (!session.user.organizationId)
    return res.status(400).json({ error: "Organization not found for user" });

  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const page = Math.max(0, parseInt(text(req.query.page), 10) || 0);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(text(req.query.pageSize), 10) || 20)
  );
  const search = text(req.query.search).toLowerCase().trim();

  await dbConnect();
  const organizationId = new Types.ObjectId(
    String(session.user.organizationId)
  );

  // Hours typed into the old "Log Hours" form (before clock in and out).
  const parents = await EventParent.find(
    { organizationId },
    { _id: 1, title: 1, tasks: 1 }
  ).lean<{ _id: Types.ObjectId; title?: string; tasks?: unknown }[]>();
  const parentById = new Map(parents.map((p) => [String(p._id), p]));
  const shifts = parents.length
    ? await Event.find(
        { eventParent: { $in: parents.map((p) => p._id) } },
        { _id: 1, date: 1, eventParent: 1 }
      ).lean<
        { _id: Types.ObjectId; date?: Date; eventParent: Types.ObjectId }[]
      >()
    : [];
  const shiftById = new Map(shifts.map((s) => [String(s._id), s]));
  const logs = shifts.length
    ? await VolunteerLog.find(
        {
          eventId: { $in: shifts.map((s) => s._id) },
          inTime: { $exists: true, $ne: null },
          outTime: { $exists: true, $ne: null },
        },
        { userId: 1, eventId: 1, inTime: 1, outTime: 1 }
      ).lean<
        {
          _id: Types.ObjectId;
          userId: Types.ObjectId;
          eventId: Types.ObjectId;
          inTime: Date;
          outTime: Date;
        }[]
      >()
    : [];
  const loggers = logs.length
    ? await User.find(
        {
          _id: {
            $in: [...new Set(logs.map((l) => String(l.userId)))].map(
              (id) => new Types.ObjectId(id)
            ),
          },
        },
        { firstName: 1, lastName: 1 }
      ).lean<{ _id: Types.ObjectId; firstName?: string; lastName?: string }[]>()
    : [];
  const loggerById = new Map(loggers.map((u) => [String(u._id), u]));

  // Finished Clock In / Clock Out records, with the tasks chosen at sign-up.
  const clockRecords = await Attendance.find(
    { organizationId, checkinTime: { $ne: null }, checkoutTime: { $ne: null } },
    {
      userId: 1,
      eventId: 1,
      volunteerName: 1,
      eventName: 1,
      checkinTime: 1,
      checkoutTime: 1,
    }
  ).lean<
    {
      _id: Types.ObjectId;
      userId: Types.ObjectId;
      eventId: Types.ObjectId;
      volunteerName?: string;
      eventName?: string;
      checkinTime: Date;
      checkoutTime: Date;
    }[]
  >();
  const signUps = await Registration.find(
    { organizationId },
    { userId: 1, eventId: 1, tasks: 1 }
  ).lean<
    { userId: Types.ObjectId; eventId: Types.ObjectId; tasks?: unknown }[]
  >();
  const tasksBySignUp = new Map(
    signUps.map((s) => [
      `${String(s.userId)}:${String(s.eventId)}`,
      asTasks(s.tasks),
    ])
  );

  const entries: Entry[] = [
    ...logs.map((log): Entry => {
      const person = loggerById.get(String(log.userId));
      const shift = shiftById.get(String(log.eventId));
      const parent = shift
        ? parentById.get(String(shift.eventParent))
        : undefined;
      return {
        id: String(log._id),
        kind: "typed",
        name:
          person?.firstName != null && person?.lastName != null
            ? `${person.firstName} ${person.lastName}`
            : "—",
        eventName: parent?.title ?? "—",
        tasks: asTasks(parent?.tasks),
        date: shift?.date
          ? new Date(shift.date).toISOString().slice(0, 10)
          : formatAtlantaDate(log.inTime),
        start: log.inTime,
        end: log.outTime,
      };
    }),
    ...clockRecords
      .filter((record) => record.checkinTime && record.checkoutTime)
      .map(
        (record): Entry => ({
          id: String(record._id),
          kind: "clock",
          name: record.volunteerName || "—",
          eventName: record.eventName || "—",
          tasks:
            tasksBySignUp.get(
              `${String(record.userId)}:${String(record.eventId)}`
            ) ?? [],
          date: formatAtlantaDate(record.checkinTime),
          start: record.checkinTime,
          end: record.checkoutTime,
        })
      ),
  ].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const matches = search
    ? entries.filter(
        (entry) =>
          entry.name.toLowerCase().includes(search) ||
          entry.eventName.toLowerCase().includes(search) ||
          entry.tasks.join(" ").toLowerCase().includes(search)
      )
    : entries;
  const lastPage = Math.max(0, Math.ceil(matches.length / pageSize) - 1);
  const shownPage = Math.min(page, lastPage);
  return res.status(200).json({
    entries: matches.slice(
      shownPage * pageSize,
      shownPage * pageSize + pageSize
    ),
    total: matches.length,
    page: shownPage,
    pageSize,
  });
};
