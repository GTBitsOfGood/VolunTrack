import dbConnect from "../../../../../server/mongodb";
const Attendance = require("../../../../../server/mongodb/models/attendance");
const Event = require("../../../../../server/mongodb/models/event");
const { getEventVolunteers } = require("../../../../../server/actions/users");

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    const eventId = req.query.id;
    const checkInStatus: CHECK_IN_STATUS = req.query.checkInStatus;

    enum CHECK_IN_STATUS {
      WAITING = "waiting",
      CHECKED_IN = "checked in",
      CHECKED_OUT = "checked out",
    }

    const checkInStatusMap = {};

    // fetch all attendance entries for given event and sort by most recent
    const attendanceEntryRecent = async () => {};

    // for each attendance entry with a unique user ID, add to volunteerCheckInStatusMap
    // if there is an existing attendance entry with give user ID, skip

    // volunteersNotCheckedIn
    const findVolunteersWaiting = async () => {
      // get attendance entries with no check in field
      const checkedInAttendanceEntries = await Attendance.find({
        eventId,
        timeCheckedIn: { $ne: null },
      });

      // filter out volunteers that don't exist in the attendance entries
      const allVolunteerIds = (await Event.findById(eventId)).volunteers;
      const waitingVolunteerIds = allVolunteerIds.filter(
        (volunteerId) =>
          !checkedInAttendanceEntries.some(
            (entry) => entry.userId !== volunteerId
          )
      );

      // get full volunteer info and return to client
      const waitingVolunteers = (await getEventVolunteers(waitingVolunteerIds))
        .message;
      return res.status(200).json(waitingVolunteers);
    };
    // volunteersCheckedIn
    const findVolunteersCheckedIn = async () => {
      // get attendance entries with a checked in field and no checkout field
      const checkedInAttendanceEntries = await Attendance.find({
        eventId,
        timeCheckedIn: { $ne: null },
        timeCheckedOut: null,
      });

      // filter out volunteers that don't exist in the attendance entries
      const allVolunteerIds = (await Event.findById(eventId)).volunteers;
      const checkedInVolunteerIds = allVolunteerIds.filter(
        (volunteerId) =>
          !checkedInAttendanceEntries.some(
            (entry) => entry.userId === volunteerId
          )
      );

      // get full volunteer info and return to client
      const checkedInVolunteers = (
        await getEventVolunteers(checkedInVolunteerIds)
      ).message;
      return res.status(200).json(checkedInVolunteers);
    };

    // volunteersCheckedOut
    const findVolunteersCheckedOut = async () => {
      // get attendance entries with a checked in field and a checked out field
      const checkedOutAttendanceEntries = await Attendance.find({
        eventId,
        timeCheckedIn: { $ne: null },
        timeCheckedOut: { $ne: null },
      });

      // filter out volunteers that don't exist in the attendance entries
      const allVolunteerIds = (await Event.findById(eventId)).volunteers;
      const checkedOutVolunteerIds = allVolunteerIds.filter(
        (volunteerId) =>
          !checkedOutAttendanceEntries.some(
            (entry) => entry.userId === volunteerId
          )
      );

      // get full volunteer info and return to client
      const checkedOutVolunteers = (
        await getEventVolunteers(checkedOutVolunteerIds)
      ).message;
      return res.status(200).json(checkedOutVolunteers);
    };

    switch (checkInStatus) {
      case CHECK_IN_STATUS.WAITING:
        await findVolunteersWaiting();
        break;
      case CHECK_IN_STATUS.CHECKED_IN:
        await findVolunteersCheckedIn();
        break;
      case CHECK_IN_STATUS.CHECKED_OUT:
        await findVolunteersCheckedOut();
        break;
    }
  }
}
