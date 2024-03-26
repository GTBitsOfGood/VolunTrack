import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next/types";
import { createHistoryEventDeleteEvent } from "../../../../../server/actions/historyEvent";
import dbConnect from "../../../../../server/mongodb";
import Attendance from "../../../../../server/mongodb/models/Attendance";
import Event, {
  EventDocument,
} from "../../../../../server/mongodb/models/Event";
import EventParent from "../../../../../server/mongodb/models/EventParent";
import Registration from "../../../../../server/mongodb/models/Registration";
import { authOptions } from "../../auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const eventId = req.query.id as string;

  const event = await Event.findById(eventId);
  if (!event)
    return res
      .status(404)
      .json({ error: `Event with id ${eventId} not found` });

  const eventParent = await EventParent.findById(event.eventParent);
  if (!eventParent)
    return res.status(404).json({
      error: `Event with id ${eventId} has no EventParent`,
    });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res.status(400).json({ error: "User session not found" });
  const user = session.user;

  const eventParentId = event.eventParent;
  const currDate = event.date;
  //deleting all attendance and registration info
  await Event.find({ eventParent: eventParentId }).then(
    async (docsToDelete) => {
      const docIds = docsToDelete.map((doc) => doc._id);
      await Attendance.deleteMany({ eventId: { $in: docIds } });
      await Registration.deleteMany({ eventId: { $in: docIds } });
    }
  );

  await Event.deleteMany({ eventParent: eventParentId });
  await EventParent.findByIdAndDelete(eventParentId);

  await createHistoryEventDeleteEvent(user, event, eventParent);

  return res.status(204).end();
};