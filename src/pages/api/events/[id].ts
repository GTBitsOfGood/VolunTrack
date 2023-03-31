import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import Event, { EventData } from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import { UpdateEventRequestBody } from "../../../queries/events";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    { event?: HydratedDocument<EventData> } | { eventId?: Types.ObjectId }
  >
) => {
  await dbConnect();

  const id = req.query.id as string;

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404);
  }

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ event: await event.populate("eventParent") });
    }
    case "PUT": {
      const { eventData, sendConfirmationEmail } = req.body as {
        eventData: UpdateEventRequestBody;
        sendConfirmationEmail: boolean;
      };

      if (!("eventParent" in eventData)) {
        // Don't need to update EventParent
        await event.updateOne(eventData);
        return res.status(200).json({ eventId: event._id });
      } else if (eventData.eventParent instanceof Types.ObjectId) {
        // Update EventParent to new ObjectId
        await event.updateOne(eventData);
        return res.status(200).json({ eventId: event._id });
      } else {
        // Update EventParent to new EventParentData
        const eventParentId = event.eventParent;
        await EventParent.findByIdAndUpdate(
          eventParentId,
          eventData.eventParent
        );
        return res.status(200).json({ eventId: event._id });
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

      return res.status(200).json({ eventId: event._id });
    }
  }
};
