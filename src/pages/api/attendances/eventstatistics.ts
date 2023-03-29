import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    let start = req.query.startDate;
    let end = req.query.endDate;
    let filter = {};
    if (start !== "undefined" && end !== "undefined") {
      start = new Date(start);
      end = new Date(end);
      filter = { checkinTime: { $gte: start, $lt: end } };
    } else if (start !== "undefined") {
      start = new Date(start);
      filter = { checkinTime: { $gte: start } };
    } else if (end !== "undefined") {
      end = new Date(end);
      filter = { checkinTime: { $lt: end } };
    }

    const attendance = await Attendance.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$eventId",
          num: { $count: {} },
          uniqueUsers: { $addToSet: "$userId" },
          minutes: {
            $sum: {
              $dateDiff: {
                startDate: "$checkinTime",
                endDate: "$checkoutTime",
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
