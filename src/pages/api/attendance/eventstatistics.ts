import dbConnect from "../../../../server/mongodb";
const Attendance = require("../../../../server/mongodb/models/attendance");

export default async function handler(req, res) {

    
  await dbConnect();
  if (req.method === "GET") {
   
    var start = req.query.startDate;
    var end = req.query.endDate;
    
    var attendance;

    if (start !== "undefined" && end !== "undefined") {
      start = new Date(start);
      end = new Date(end);
      
      attendance = await Attendance.aggregate([
          {
              $match: {
                  timeCheckedIn: {$gte:start,$lt:end} 
              },
            },{
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
          
              },
              
          }
      ]);
    } else if (start !== "undefined") {
      start = new Date(start);
      
      attendance = await Attendance.aggregate([
          {
              $match: {
                  timeCheckedIn: {$gte:start} 
              },
            },{
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
          
              },
              
          }
      ]);
    } else if (end !== "undefined") {
      end = new Date(end);
      
      attendance = await Attendance.aggregate([
          {
              $match: {
                  timeCheckedIn: {$lt:end} 
              },
            },{
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
          
              },
              
          }
      ]);
    } else {
      attendance = await Attendance.aggregate([
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
          
              },
              
          }
      ]);
    }
    if (!attendance) {
        return res.status(400);
      }
    return res.status(200).json(attendance);
  }
}
