const AttendanceData = require("../mongodb/models/attendance");
import { scheduler } from "../jobs/scheduler";
import dbConnect from "../mongodb/index";
const User = require("../mongodb/models/User");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;


export async function getEventsByUserID(userId, next) {
  await dbConnect();

  // //console.log("HERE" + userId)

  // if (userId === "undefined") {
  //   return { status: 400, message: { error: "Invalid userId sent" } };
  // } else {
  //   return EventData.find({  })
  //     .then((events) => {
  //       return events;
  //     })
  //     .catch(next);
  // }

  return AttendanceData.find({userId: userId})
      .then((events) => {
        
        return events;
      })
      .catch(next);
}

// export async function updateEvent(updateEventData, next) {
//   await dbConnect();

//   return EventData.findOneAndUpdate(
//     { _id: updateEventData._id },
//     updateEventData,
//     {
//       new: true,
//     }
//   )
//     .then((event) => {
//       return event;
//     })
//     .catch((err) => {
//       next(err);
//     });
// }

// export async function deleteEventID(eventID, next) {
//   await dbConnect();

//   return EventData.findOneAndDelete({ _id: eventID })
//     .then(() => {
//       return;
//     })
//     .catch(next);
// }

// export async function updateEventID(eventID, event, next) {
//   await dbConnect();

//   return EventData.findByIdAndUpdate(eventID, event, {
//     new: true,
//     useFindAndModify: false,
//   })
//     .then(() => {
//       return event;
//     })
//     .catch(next);
// }

// export async function getEventVolunteersList(eventId, next) {
//   await dbConnect();

//   let result = {
//     volunteer: [],
//     minor: {},
//   };
//   let volunteers = [];
//   let minors = [];
//   await EventData.find({ _id: eventId })
//     .then((event) => {
//       volunteers = event[0].volunteers;
//       volunteers = volunteers.map(mongoose.Types.ObjectId);
//       minors = event[0].minors;
//     })
//     .catch(next);
//   await User.find({ _id: { $in: volunteers } })
//     .then((users) => {
//       for (const user of users) {
//         const name = user.bio.first_name + " " + user.bio.last_name;
//         result.volunteer.push(name);
//       }
//     })
//     .catch(next);
//   for (const minor of minors) {
//     await User.findOne({ _id: ObjectId(minor.volunteer_id) })
//       .then((user) => {
//         const name = user.bio.first_name + " " + user.bio.last_name;
//         result.minor[name] = minor.minor;
//       })
//       .catch(next);
//   }
//   return result;
// }

// export async function getEventByID(eventID) {
//   await dbConnect();

//   return EventData.findById(eventID).then((event) => {
//     return event;
//   });
// }
