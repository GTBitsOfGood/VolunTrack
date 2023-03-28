import dbConnect from "../../../../server/mongodb";
import mongoose from "mongoose";
const Attendance = require("../../../../server/mongodb/models/attendance");
const ObjectId = mongoose.Types.ObjectId;

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const attendance = await Attendance.aggregate([
      {
        $match: { eventId: ObjectId(req.body.eventId) },
      },
      {
        $addFields: {
          minutes: {
            $sum: {
              $dateDiff: {
                startDate: "$timeCheckedIn",
                endDate: "$timeCheckedOut",
                unit: "minute",
              },
            },
          },
        },
      },
    ]);

    if (!attendance) {
      return res.status(400);
    }
    return res.status(200).json(attendance);
  }
}
