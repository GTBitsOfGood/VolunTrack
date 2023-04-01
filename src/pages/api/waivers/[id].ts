import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Waiver, {
  WaiverData,
  waiverValidator,
} from "../../../../server/mongodb/models/Waiver";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const waiverId = req.query.id as string;
  const waiver = await Waiver.findById(waiverId);
  if (!waiver)
    return res
      .status(404)
      .json({ message: `Waiver with id ${waiverId} not found` });

  switch (req.method) {
    case "PUT": {
      if (waiverValidator.partial().safeParse(req.body).success) {
        await waiver.updateOne(req.body as WaiverData);
        return res.status(200).json({ waiver });
      }
    }
  }
};
