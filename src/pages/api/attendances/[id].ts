const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const attendanceId = req.query.id;
    const attendance = await Attendance.updateOne(
      { _id: attendanceId },
      req.body.newData
    );
    return res.status(200).json(attendance);
  }
  if (req.method === "DELETE") {
    const attendanceId = req.query.id;
    Attendance.findOneAndDelete({ _id: attendanceId }).then(() => {
      return res.status(200).send();
    });
  }
}
