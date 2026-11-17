import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../server/mongodb";
import Event from "../../../../server/mongodb/models/Event";
import Registration from "../../../../server/mongodb/models/Registration";
import User from "../../../../server/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]";

type SignUpRow = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  approved?: string;
  minors?: unknown[];
  tasks?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const time = (value?: Date) => (value ? new Date(value).getTime() : 0);

// Everything the Approval Portal shows, in one request: all new requests and
// one page of the history, each with its shift and the person's contact
// details. The page used to load every sign-up ever and then ask for each
// shift separately (over a thousand requests for a busy organization).
// Sorting happens here, not in the database: the live site's database (Azure
// Cosmos DB) refuses to sort on fields without an index.
// GET /api/registrations/approvals?page=0&pageSize=3
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "Sign in first" });
  if (session.user.role !== "admin")
    return res.status(403).json({ error: "Admins only" });
  if (!session.user.organizationId)
    return res.status(400).json({ error: "Organization not found for user" });

  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const page = Math.max(0, parseInt(text(req.query.page), 10) || 0);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(text(req.query.pageSize), 10) || 3)
  );

  await dbConnect();
  const organizationId = new Types.ObjectId(
    String(session.user.organizationId)
  );
  const signUps = await Registration.find(
    { organizationId },
    {
      userId: 1,
      eventId: 1,
      approved: 1,
      minors: 1,
      tasks: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  ).lean<SignUpRow[]>();

  // Sign-ups for deleted shifts are not shown (as before).
  const shiftIds = [...new Set(signUps.map((s) => String(s.eventId)))];
  const existing = new Set(
    (
      await Event.find(
        { _id: { $in: shiftIds.map((id) => new Types.ObjectId(id)) } },
        { _id: 1 }
      ).lean<{ _id: Types.ObjectId }[]>()
    ).map((e) => String(e._id))
  );
  const live = signUps.filter((s) => existing.has(String(s.eventId)));

  const pending = live
    .filter((s) => s.approved === "pending")
    .sort(
      (a, b) =>
        time(a.createdAt) - time(b.createdAt) ||
        String(a._id).localeCompare(String(b._id))
    );
  const decided = live
    .filter((s) => s.approved !== "pending")
    .sort(
      (a, b) =>
        time(b.updatedAt) - time(a.updatedAt) ||
        String(b._id).localeCompare(String(a._id))
    );
  const lastPage = Math.max(0, Math.ceil(decided.length / pageSize) - 1);
  const shownPage = Math.min(page, lastPage);
  const history = decided.slice(
    shownPage * pageSize,
    shownPage * pageSize + pageSize
  );
  const shown = [...pending, ...history];

  const shownShiftIds = [...new Set(shown.map((s) => String(s.eventId)))];
  const shifts = shownShiftIds.length
    ? await Event.find({
        _id: { $in: shownShiftIds.map((id) => new Types.ObjectId(id)) },
      })
        .populate("eventParent")
        .lean()
    : [];
  const shiftById = new Map(shifts.map((shift) => [String(shift._id), shift]));

  const peopleIds = [...new Set(shown.map((s) => String(s.userId)))];
  const people = peopleIds.length
    ? await User.find(
        { _id: { $in: peopleIds.map((id) => new Types.ObjectId(id)) } },
        { firstName: 1, lastName: 1, email: 1, phone: 1 }
      ).lean<
        {
          _id: Types.ObjectId;
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
        }[]
      >()
    : [];
  const personById = new Map(people.map((p) => [String(p._id), p]));

  // Spots taken on each shown shift: approved sign-ups plus their minors.
  const regCounts: Record<string, number> = {};
  for (const id of shownShiftIds) regCounts[id] = 0;
  for (const s of live) {
    const id = String(s.eventId);
    if (id in regCounts && s.approved === "approved")
      regCounts[id] += 1 + (s.minors?.length ?? 0);
  }

  const withDetails = (s: SignUpRow) => {
    const person = personById.get(String(s.userId));
    return {
      ...s,
      event: shiftById.get(String(s.eventId)) ?? null,
      user: person
        ? {
            firstName: person.firstName ?? "",
            lastName: person.lastName ?? "",
            email: person.email ?? "",
            phone: person.phone ?? "",
          }
        : null,
    };
  };

  return res.status(200).json({
    pending: pending.map(withDetails),
    history: history.map(withDetails),
    historyTotal: decided.length,
    page: shownPage,
    pageSize,
    regCounts,
  });
};
