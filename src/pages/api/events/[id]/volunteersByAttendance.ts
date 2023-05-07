// import dbConnect from "../../../../../server/mongodb";
// import Attendance from "../../../../../server/mongodb/models/Attendance";
// import Event from "../../../../../server/mongodb/models/Event";
// import { getUsers } from "../../../../queries/users";

// export default async function handler(req, res) {
//   await dbConnect();
//   if (req.method === "GET") {
//     const eventId = req.query.id;
//     const checkInStatus: CHECK_IN_STATUS = req.query.checkInStatus;

//     enum CHECK_IN_STATUS {
//       WAITING = "waiting",
//       CHECKED_IN = "checked in",
//       CHECKED_OUT = "checked out",
//     }

//     // eslint-disable-next-line no-unused-vars
//     type volunteer = {
//       event: string;
//       eventName: string;
//       userId: string;
//       volunteerName: string;
//       volunteerEmail: string;
//       timeCheckedIn: string;
//       timeCheckedOut: string;
//     };

//     const fetchAttendanceEntries = async () => {
//       const checkInStatusMap = {};
//       // fetch all attendance entries for given event and sort by most recent

//       const allVolunteerIds = (await Event.findById(eventId)).volunteers;
//       const allVolunteerAttendanceEntries = await Attendance.find({
//         $and: [{ userId: { $in: allVolunteerIds } }, { eventId: eventId }],
//       }).sort({ timeCheckedOut: -1, timeCheckedIn: -1 });

//       allVolunteerIds.forEach((volunteerId) => {
//         if (!(volunteerId in checkInStatusMap)) {
//           checkInStatusMap[volunteerId] = allVolunteerAttendanceEntries.find(
//             (attendanceEntry) =>
//               String(attendanceEntry.userId) === String(volunteerId)
//           );
//         }
//       });

//       return checkInStatusMap;
//     };

//     // volunteersNotCheckedIn
//     const findVolunteersWaiting = async () => {
//       // get attendance entries with no check in field
//       const checkedInAttendanceEntries = await Attendance.find({
//         eventId,
//         timeCheckedIn: { $ne: null },
//       });

//       // filter out volunteers that don't exist in the attendance entries
//       const allVolunteerIds = (await Event.findById(eventId)).volunteers;
//       const waitingVolunteerIds = allVolunteerIds.filter(
//         (volunteerId) =>
//           !checkedInAttendanceEntries.some(
//             (entry) => entry.userId !== volunteerId
//           )
//       );

//       // get full volunteer info and return to client
//       const waitingVolunteers = (await getUsers(waitingVolunteerIds)).message;
//       return res.status(200).json(waitingVolunteers);
//     };

//     // volunteersCheckedIn
//     const findVolunteersCheckedIn = async () => {
//       const volunteers = await fetchAttendanceEntries();
//       const volunteersCheckedIn = Object.values(volunteers).filter(
//         (volunteer: volunteer) =>
//           volunteer?.timeCheckedOut == null && volunteer?.timeCheckedIn != null
//       );
//       const volunteerIdsCheckedIn = volunteersCheckedIn.map(
//         (volunteer: volunteer) => volunteer.userId
//       );

//       // get full volunteer info and return to client
//       const checkedInVolunteers = (
//         await getUsers(volunteerIdsCheckedIn)
//       ).message;
//       return res.status(200).json(checkedInVolunteers);
//     };

//     // volunteersCheckedOut
//     const findVolunteersCheckedOut = async () => {
//       // get attendance entries with a checked in field and a checked out field
//       const volunteers = await fetchAttendanceEntries();

//       const volunteersCheckedOut = Object.values(volunteers).filter(
//         (volunteer: volunteer) => volunteer?.timeCheckedOut != null
//       );

//       const volunteerIdsCheckedOut = volunteersCheckedOut.map(
//         (volunteer: volunteer) => volunteer.userId
//       );

//       // get full volunteer info and return to client
//       const checkedOutVolunteers = (
//         await getEventVolunteers(volunteerIdsCheckedOut)
//       ).message;
//       return res.status(200).json(checkedOutVolunteers);
//     };

//     switch (checkInStatus) {
//       case CHECK_IN_STATUS.WAITING:
//         await findVolunteersWaiting();
//         break;
//       case CHECK_IN_STATUS.CHECKED_IN:
//         await findVolunteersCheckedIn();
//         break;
//       case CHECK_IN_STATUS.CHECKED_OUT:
//         await findVolunteersCheckedOut();
//         break;
//     }
//   }
// }
