import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {

    
  await dbConnect();
  if (req.method === "GET") {
    //const eventId = req.body.eventId;

    // const getHours = (startTime, endTime) => {
    //     var timeStart = new Date("01/01/2007 " + startTime);
    //     var timeEnd = new Date("01/01/2007 " + endTime);
      
    //     let hours = Math.abs(timeEnd - timeStart) / 36e5;
      
    //     if (hours < 0) {
    //       hours = 24 + hours;
    //     }
      
    //     return Math.round(hours * 10) / 10.0;
    // };

    // const attendance = await Attendance.find({
        
    // });
    const attendance = await Attendance.aggregate([
        {
            $group: {
                _id: "$eventId",
               num: { $count: {} },
               hours: { $sum : {
                $dateDiff : {
                    startDate: "$timeCheckedIn",
                    endDate: "$timeCheckedOut",
                    unit: "hour",
                }
               }}
        
            }
        }

    ]);
    if (!attendance) {
        return res.status(400);
      }
        
    // var groupBy = function(xs, key) {
    //     return xs.reduce(function(rv, x) {
    //       (rv[x[key]] = rv[x[key]] || []).push(x);
    //       return rv;
    //     }, {});
    //   };

    // let attendanceByGroup = groupBy(attendance, 'eventId')
    
    
    // let returnArray = []
    // for (var i = 0; i < attendanceByGroup.length; i++) {
    //     // let currEvent = []
        
    //     // let hours = getHours(event.timeCheckedIn.substring(11), event.timeCheckedOut.substring(11))
        
    //     // const newDoc = {
    //     //     eventId: event.eventId,
    //     //     count: event.length,
    //     //     hours: 1, 
    //     // }

    //     returnArray.push("hello")

    // }
    return res.status(200).json(attendance);

    // // let attendanceStats = [];
    // // for (let document of attendance) {
    // //   let hours = -1;
    // //   if (document.timeCheckedOut != null) {
    // //     hours =
    // //       Math.abs(document.timeCheckedOut - document.timeCheckedIn) / 36e5;
    // //   }
    // //   const newDoc = {
    // //     ...document._doc,
    // //     hours: hours,
    // //   };
    // //   attendanceStats.push(newDoc);
    // // }
    // return res.status(200).json(attendanceByGroup);
  }
}
