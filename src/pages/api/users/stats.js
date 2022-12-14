import {getAllAttendanceObjects} from "../../../../server/actions/volunteerstats";

const {
  getAttendanceByUserID,
} = require("../../../../server/actions/volunteerstats");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let attendances;
    if (req.query.volunteer) attendances = await getAttendanceByUserID(req.query.volunteer, next);
    else attendances = await getAllAttendanceObjects(next);

    return res.status(200).json({
      attendances,
    });
  }
}
