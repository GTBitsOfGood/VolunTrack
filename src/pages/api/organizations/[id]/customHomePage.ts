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
        if (!organization.homePage) {
          return res
            .status(404)
            .json({ message: "Organization home page not found." });
        }

        return res.status(200).json({ homePage: organization.homePage });
      }

      case "POST": {
        const isadmin = await isAdmin(req, res);
        if (!isadmin) {
          return res.status(403).json({
            error: "Only Admins can modify an organization Home Page",
          });
        }

        const homePage = req.body.homePage;

        if (!homePage || typeof homePage !== "string") {
          return res
            .status(400)
            .json({ error: "Missing or Invalid field: homePage" });
        }

        const sanitizedHomePage = purify.sanitize(homePage);

        await Organization.updateOne(
          { _id: new ObjectId(id) },
          { $set: { homePage: sanitizedHomePage } }
        );

        res.status(200).json({ message: "Successfully updated home page" });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "An Internal Server Error Occurred: " + String(error),
    });
  }
};
