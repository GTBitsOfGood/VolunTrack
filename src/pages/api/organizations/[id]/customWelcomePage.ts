import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { ObjectId } from "mongodb";
import { isAdmin } from "../../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

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
        // If no welcome page is set yet, return 200 with empty content
        const welcomePage = organization.welcomePage || "";
        return res.status(200).json({ welcomePage });
      }

      case "POST": {
        const isadmin = await isAdmin(req, res);
        if (!isadmin) {
          return res.status(403).json({
            error: "Only Admins can modify an organization Welcome Page",
          });
        }

        const welcomePage = req.body.welcomePage;

        if (!welcomePage || typeof welcomePage !== "string") {
          return res
            .status(400)
            .json({ error: "Missing or Invalid field: welcomePage" });
        }

        const sanitizedWelcomePage = purify.sanitize(welcomePage);

        await Organization.updateOne(
          { _id: new ObjectId(id) },
          { $set: { welcomePage: sanitizedWelcomePage } }
        );

        res.status(200).json({ message: "Successfully updated welcome page" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "An Internal Server Error Occurred: " + String(error),
    });
  }
};
