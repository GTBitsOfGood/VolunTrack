import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import {
  calendarDays,
  FEED_VIEWS,
  FeedView,
  loadFullEvents,
  loadMySignUps,
  loadOrgEvents,
  nowWallClockText,
  pickFeed,
} from "../../../../server/actions/eventFeed";
import dbConnect from "../../../../server/mongodb";
import { authOptions } from "../auth/[...nextauth]";

const text = (value: unknown) =>
  typeof value === "string" ? value : undefined;

// One page of shifts for the Events and Home pages (see server/actions/eventFeed).
// GET /api/events/feed?view=upcoming|month|all|public|private|day|home
//   &page=0&pageSize=3&now=YYYY-MM-DDTHH:mm[&day=YYYY-MM-DD][&month=YYYY-MM][&dates=1]
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "Sign in first" });
  const { organizationId, role, _id: userId } = session.user;
  if (!organizationId)
    return res.status(400).json({ error: "Organization not found for user" });

  const view = (text(req.query.view) ?? "upcoming") as FeedView;
  if (!FEED_VIEWS.includes(view))
    return res.status(400).json({ error: `Unknown view: ${view}` });
  const day = text(req.query.day);
  const month = text(req.query.month);
  if (view === "day" && !/^\d{4}-\d{2}-\d{2}$/.test(day ?? ""))
    return res.status(400).json({ error: "day must look like 2026-11-16" });
  if (view === "month" && !/^\d{4}-\d{2}$/.test(month ?? ""))
    return res.status(400).json({ error: "month must look like 2026-11" });
  const page = Math.max(0, parseInt(text(req.query.page) ?? "0", 10) || 0);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(text(req.query.pageSize) ?? "3", 10) || 3)
  );

  await dbConnect();
  const org = new Types.ObjectId(String(organizationId));
  const all = await loadOrgEvents(org);
  const mySignUps =
    role === "admin"
      ? new Map<string, string>()
      : await loadMySignUps(new Types.ObjectId(String(userId)), org);
  const { ids, total } = pickFeed({
    all,
    role,
    mySignUps,
    view,
    now: nowWallClockText(text(req.query.now)),
    day,
    month,
    page,
    pageSize,
  });
  const events = await loadFullEvents(ids, all);
  return res.status(200).json({
    events,
    total,
    page,
    pageSize,
    ...(req.query.dates === "1" ? { dates: calendarDays(all, role) } : {}),
  });
};
