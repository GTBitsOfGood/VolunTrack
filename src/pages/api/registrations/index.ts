import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb/index";
import Registration from "../../../../server/mongodb/models/Registration";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Types.ObjectId>
) => {
  switch (req.method) {
    case "POST": {
      const { minors, event, user } = req.body as {
        minors: string[];
        event: Types.ObjectId;
        user: Types.ObjectId;
      };

      await dbConnect();
      const registration = await Registration.create({ minors, event, user });
      return res.status(201).json(registration._id);
    }
  }
};
