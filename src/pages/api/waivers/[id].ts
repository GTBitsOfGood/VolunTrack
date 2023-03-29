import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import Waiver, { WaiverData } from "../../../../server/mongodb/models/Waiver";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{ waiverId: Types.ObjectId } | { message: string }>
) => {
  switch (req.method) {
    case "PUT": {
      const id = req.query.id as string;
      const waiverData = req.body as Partial<WaiverData>;

      const waiver = await Waiver.findById(new Types.ObjectId(id));
      if (!waiver) {
        return res
          .status(404)
          .json({ message: `Waiver with id ${id} not found` });
      }
      await waiver.updateOne(waiverData);
      return res.status(200).json({ waiverId: waiver._id });
    }
  }
};
