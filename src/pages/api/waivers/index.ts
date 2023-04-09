import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Waiver from "../../../../server/mongodb/models/Waiver";
import { waiverInputValidator } from "../../../validators/waivers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (
        req.query.type &&
        !["adult", "minor"].includes(req.query.type as string)
      )
        return res.status(400).json({ success: false, error: "Invalid type" });
      if (
        req.query.organizationId &&
        !isValidObjectId(req.query.organizationId as string)
      )
        return res
          .status(400)
          .json({ success: false, error: "Invalid organizationId" });

      const type = req.query.type ? (req.query.type as string) : undefined;
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      return res.status(200).json({
        success: true,
        waivers: await Waiver.find({ type, organizationId }),
      });
    }
    case "POST": {
      const type = req.body.type;
      const organizationId = req.body.organizationId;
      const text = req.body.text;

      const result = waiverInputValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await Waiver.findOneAndUpdate(
        { type: type, organizationId: organizationId },
        { text: text },
        { upsert: true }
      ).then((waiver) => {
        return res.status(200).json({ success: true, waiver });
      });
    }
  }
};
