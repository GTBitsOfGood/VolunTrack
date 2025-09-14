import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../server/mongodb";
import Registration from "../../../../server/mongodb/models/Registration";
import { isAdmin } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const isadmin = await isAdmin(req, res);
    if (!isadmin) {
      return res.status(403).json({ error: "Only Admins can view pending registrations" });
    }

    const organizationId = req.query.organizationId;
    if (!organizationId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }
    const pendingRegistrations = await Registration.find({
      organizationId: organizationId,
      approved: "pending"
    })
    .populate('userId', 'firstName lastName email')
    .populate({
      path: 'eventId',
      populate: {
        path: 'eventParent',
        select: 'title description startTime endTime address city state zip eventContactEmail pocName'
      }
    })
    .sort({ createdAt: -1 });

    return res.status(200).json({ pendingRegistrations });
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
