import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Waiver, { WaiverData } from "../../../../server/mongodb/models/Waiver";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<HydratedDocument<WaiverData>[]>
) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const type = req.query.type as "adult" | "minor";
      const organizationId = req.query.organizationId as string;

      return res.status(200).json(await Waiver.find({ type, organizationId }));
    }
  }
};
