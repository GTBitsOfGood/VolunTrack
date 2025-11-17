import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import User from "../../../../../server/mongodb/models/User";
import { isOwnUser } from "../../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const userId = req.query.id as string;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: `User with id ${userId} not found` });
  }

  switch (req.method) {
    case "GET": {
      return res.status(200).json({
        applicationResponses: user.applicationResponses || []
      });
    }

    case "POST": {
      const isownuser = await isOwnUser(req, res);
      if (!isownuser) {
        return res.status(403).json({
          error: "Only the user can submit their own application responses",
        });
      }

      const { applicationResponses } = req.body;

      if (!Array.isArray(applicationResponses)) {
        return res.status(400).json({
          error: "applicationResponses must be an array",
        });
      }

      await user.updateOne({ applicationResponses });

      return res.status(200).json({
        success: true,
        message: "Application responses submitted successfully"
      });
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        message: `Method ${req.method ?? "undefined"} not allowed`
      });
  }
};
