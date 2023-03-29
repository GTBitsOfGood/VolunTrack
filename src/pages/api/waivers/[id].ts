import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import Waiver, { WaiverData } from "../../../../server/mongodb/models/Waiver";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{ waiverId?: Types.ObjectId }>
) => {
  const id = req.query.id as string;
  const waiver = await Waiver.findById(new Types.ObjectId(id));
  if (!waiver) return res.status(404);

  switch (req.method) {
    case "PUT": {
      const waiverData = req.body as Partial<WaiverData>;

      await waiver.updateOne(waiverData);
      return res.status(200).json({ waiverId: waiver._id });
    }
  }
};
