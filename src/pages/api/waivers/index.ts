import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Waiver, {
  waiverInputServerValidator,
} from "../../../../server/mongodb/models/Waiver";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { createHistoryEventWaiverEdited } from "../../../../server/actions/historyEvent";
import { isAdmin } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (
        req.query.type &&
        !["adult", "minor"].includes(req.query.type as string)
      )
        return res.status(400).json({ error: "Invalid type" });
      if (
        req.query.organizationId &&
        !isValidObjectId(req.query.organizationId as string)
      )
        return res.status(400).json({ error: "Invalid organizationId" });

      const type = req.query.type ? (req.query.type as string) : undefined;
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      return res.status(200).json({
        waivers: await Waiver.find({ type, organizationId }),
      });
    }
    case "POST": {
      const result = waiverInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      const session = await getServerSession(req, res, authOptions);
      if (!session?.user)
        return res
          .status(400)
          .json({ error: "User session not found to create event" });

      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can create/modify waivers" });
      }

      const user = session.user;
      await createHistoryEventWaiverEdited(user, result.data.type);
      const waiver = await Waiver.findOneAndUpdate(
        { organizationId: result.data.organizationId, type: result.data.type },
        result.data,
        {
          upsert: true,
        }
      );

      return res.status(200).json({ waiver });
    }
  }
};
