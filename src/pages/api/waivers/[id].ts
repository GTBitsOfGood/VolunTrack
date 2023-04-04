import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Waiver from "../../../../server/mongodb/models/Waiver";
import { waiverInputValidator } from "../../../validators/waivers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const waiverId = req.query.id as string;
  const waiver = await Waiver.findById(waiverId);
  if (!waiver)
    return res
      .status(404)
      .json({ success: false, error: `Waiver with id ${waiverId} not found` });

  switch (req.method) {
    case "PUT": {
      const result = waiverInputValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await waiver.updateOne(result.data);
      return res.status(200).json({ success: true, waiver });
    }
  }
};
