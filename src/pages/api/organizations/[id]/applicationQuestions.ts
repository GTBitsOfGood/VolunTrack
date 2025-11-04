import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import { ObjectId } from "mongodb";
import { isAdmin } from "../../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  let { id } = req.query;

  if (Array.isArray(id)) {
    id = id[0];
  }

  if (!id) {
    return res
      .status(400)
      .json({ message: "Missing or invalid organization ID." });
  }

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    switch (req.method) {
      case "GET": {
        return res
          .status(200)
          .json({ applicationQuestions: organization.applicationQuestions || [] });
      }

      case "POST": {
        const isadmin = await isAdmin(req, res);
        if (!isadmin) {
          return res.status(403).json({
            error: "Only Admins can modify application questions",
          });
        }

        const { applicationQuestions } = req.body;

        if (!Array.isArray(applicationQuestions)) {
          return res.status(400).json({
            error: "applicationQuestions must be an array",
          });
        }

        await Organization.updateOne(
          { _id: new ObjectId(id) },
          { $set: { applicationQuestions } }
        );

        return res
          .status(200)
          .json({ message: "Successfully updated application questions" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method ?? "undefined"} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An Internal Server Error Occurred: " + String(error),
    });
  }
};
