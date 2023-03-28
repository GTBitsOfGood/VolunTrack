import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb/index";
import Attendance from "../../../../../server/mongodb/models/Attendance";
import Event from "../../../../../server/mongodb/models/Event";
import EventParent from "../../../../../server/mongodb/models/EventParent";
import Registration from "../../../../../server/mongodb/models/Registration";
import { EditEventRequestBody } from "../../../../actions/queries";

export default async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const id = req.query.id as string;

  await dbConnect();
  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).send(`Event with id ${id} not found`);
  }

  switch (req.method) {
    case "PUT": {
      const eventData = req.body as EditEventRequestBody;

      if (!("eventParent" in eventData)) {
        // Don't need to update EventParent
        await event.updateOne(eventData);
        return res.status(200);
      } else if (eventData.eventParent instanceof Types.ObjectId) {
        // Update EventParent to new ObjectId
        await event.updateOne(eventData);
        return res.status(200);
      } else {
        // Update EventParent to new EventParentData
        const eventParentId = event.eventParent;
        await EventParent.findByIdAndUpdate(
          eventParentId,
          eventData.eventParent
        );
        return res.status(200);
      }
    }
    case "DELETE": {
      await Attendance.deleteMany({ event: id });
      await Registration.deleteMany({ event: id });
      await Event.findByIdAndDelete(id);

      const eventParentId = event.eventParent;
      if ((await Event.count({ eventParent: eventParentId })) === 0) {
        await EventParent.findByIdAndDelete(eventParentId);
      }

      return res.status(200);
    }
  }
};
