const Attendance = require("../../../../../server/mongodb/models/attendance");
const Event = require("../../../../../server/mongodb/models/Event");
const { getEventVolunteers } = require("../../../../../server/actions/users");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const eventId = req.query.id;
    const isCheckedIn = req.query.isCheckedIn === "true";

    const checkedInVolunteerIds = (
      await Attendance.find({
        eventId,
        checkoutTime: null,
      })
    ).map((attendance) => attendance.userId.toString());

    if (isCheckedIn) {
      const checkedInVolunteers = (
        await getEventVolunteers(checkedInVolunteerIds)
      ).message;

      return res.status(200).json(checkedInVolunteers);
    } else {
      const allVolunteerIds = (await Event.findById(eventId)).volunteers;

      const checkedOutVolunteerIds = allVolunteerIds.filter(
        (id) => !checkedInVolunteerIds.includes(id.toString())
      );

      const checkedOutVolunteers = (
        await getEventVolunteers(checkedOutVolunteerIds)
      ).message;

      return res.status(200).json(checkedOutVolunteers);
    }
  }
}
