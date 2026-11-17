import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../server/mongodb";
import HistoryEvent from "../../../../server/mongodb/models/HistoryEvent";
import User from "../../../../server/mongodb/models/User";
import { authOptions } from "../auth/[...nextauth]";

type HistoryLine = {
  _id: Types.ObjectId;
  description?: string;
  userId?: Types.ObjectId;
  createdAt?: Date;
};

// One page of the History table, newest first, with the search applied here
// (the page used to download every line). Sorting happens here, not in the
// database: the live site's database (Azure Cosmos DB) refuses to sort on
// fields without an index.
// GET /api/historyEvents?page=0&pageSize=20&search=text
const historyPage = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "Sign in first" });
  if (session.user.role !== "admin")
    return res.status(403).json({ error: "Admins only" });
  if (!session.user.organizationId)
    return res.status(400).json({ error: "Organization not found for user" });
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const page = Math.max(0, parseInt(text(req.query.page), 10) || 0);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(text(req.query.pageSize), 10) || 20)
  );
  const search = text(req.query.search).toLowerCase();
  const searchTrimmed = search.trim();

  const organizationId = new Types.ObjectId(
    String(session.user.organizationId)
  );
  const lines = await HistoryEvent.find(
    { organizationId },
    { description: 1, userId: 1, createdAt: 1 }
  ).lean<HistoryLine[]>();
  const admins = await User.find(
    { organizationId, role: "admin" },
    { firstName: 1, lastName: 1 }
  ).lean<{ _id: Types.ObjectId; firstName?: string; lastName?: string }[]>();
  const adminById = new Map(admins.map((a) => [String(a._id), a]));

  const named = lines.map((line) => {
    const admin = adminById.get(String(line.userId));
    return {
      ...line,
      firstName: admin?.firstName ?? "Unknown",
      lastName: admin?.lastName ?? "Admin",
    };
  });
  const matches = (
    search.length > 0
      ? named.filter(
          (h) =>
            h.firstName.toLowerCase().includes(search) ||
            h.lastName.toLowerCase().includes(search) ||
            `${h.firstName} ${h.lastName}`
              .toLowerCase()
              .trim()
              .includes(searchTrimmed) ||
            (h.description ?? "").toLowerCase().trim().includes(searchTrimmed)
        )
      : named
  ).sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
  const lastPage = Math.max(0, Math.ceil(matches.length / pageSize) - 1);
  const shownPage = Math.min(page, lastPage);
  return res.status(200).json({
    historyEvents: matches.slice(
      shownPage * pageSize,
      shownPage * pageSize + pageSize
    ),
    total: matches.length,
    page: shownPage,
    pageSize,
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (req.query.page !== undefined) return historyPage(req, res);
      // const keyword = req.query.keyword
      //   ? (req.query.keyword as string)
      //   : undefined;
      // const description = req.query.description
      //   ? (req.query.description as string)
      //   : undefined;
      //
      // if (req.query.userId && !isValidObjectId(req.query.userId as string))
      //   return res.status(400).json({
      //     error: `User id of ${req.query.userId as string} is invalid`,
      //   });
      // if (req.query.eventId && !isValidObjectId(req.query.eventId as string))
      //   return res.status(400).json({
      //     error: `Event id of ${req.query.eventId as string} is invalid`,
      //   });
      if (
        req.query.organizationId &&
        !isValidObjectId(req.query.organizationId as string)
      )
        return res.status(400).json({
          error: `Organization id of ${
            req.query.organizationId as string
          } is invalid`,
        });

      // const userId = req.query.userId
      //   ? new Types.ObjectId(req.query.userId as string)
      //   : undefined;
      // const eventId = req.query.eventId
      //   ? new Types.ObjectId(req.query.eventId as string)
      //   : undefined;
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      // const match: Partial<HistoryEventData> = {};
      // if (keyword) match.keyword = keyword;
      // if (description) match.description = description;
      // if (userId) match.userId = userId;
      // if (event) match.eventId = eventId;
      // if (organizationId) match.organizationId = organizationId;

      return res.status(200).json({
        historyEvents: await HistoryEvent.find({ organizationId }),
      });
    }
  }
};
