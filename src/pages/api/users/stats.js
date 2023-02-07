const {
  getAttendanceByUserID,
} = require("../../../../server/actions/volunteerstats");

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let attendances;
    if (req.query.volunteer != null)
      attendances = await getAttendanceByUserID(req.query.volunteer, next);
    else return res.status(200).json({});

    return res.status(200).json({
      attendances,
    });
  }
}
