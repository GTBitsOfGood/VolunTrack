import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import { homeSummary } from "../../../../server/actions/eventFeed";
import dbConnect from "../../../../server/mongodb";
import { attendanceWallTime } from "../../../../utils/dates";
import { authOptions } from "../auth/[...nextauth]";

// The Overview numbers and charts at the top of the admin Home page, worked out
// here so the page no longer downloads every event and attendance record.
// GET /api/events/home-summary?today=YYYY-MM-DD
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "Sign in first" });
  if (session.user.role === "volunteer")
    return res.status(403).json({ error: "Admins and managers only" });
  if (!session.user.organizationId)
    return res.status(400).json({ error: "Organization not found for user" });

  const sent = typeof req.query.today === "string" ? req.query.today : "";
  const today = /^\d{4}-\d{2}-\d{2}$/.test(sent)
    ? sent
    : attendanceWallTime(new Date()).slice(0, 10);

  await dbConnect();
  return res
    .status(200)
    .json(
      await homeSummary(
        new Types.ObjectId(String(session.user.organizationId)),
        today
      )
    );
};
