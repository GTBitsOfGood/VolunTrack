import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb/index";
import Attendance from "../../../../server/mongodb/models/Attendance";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Types.ObjectId>
) => {
  switch (req.method) {
    case "POST": {
      const { event, user } = req.body as {
        event: Types.ObjectId;
        user: Types.ObjectId;
      };

      await dbConnect();
      const attendance = await Attendance.create({
        event,
        user,
        timeCheckedIn: new Date(),
      });
      return res.status(201).json(attendance._id);
    }
  }
};
