import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next/types";
import {
  createHistoryEventDeleteEvent,
  createHistoryEventEditEvent,
} from "../../../../server/actions/historyEvent";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import Event, {
  eventInputServerValidator,
  eventPopulatedInputServerValidator,
} from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import User, { UserDocument } from "../../../../server/mongodb/models/User";
import { sendEventEditedEmail } from "../../../utils/mailersend-email.js";
import { authOptions } from "../auth/[...nextauth]";

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
  //This doesn't need a user session check because we need this for check-in.
  if (req.method === "GET") {
    return res.status(200).json({ event: await event.populate("eventParent") });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res.status(400).json({ error: "User session not found" });
  const user = session.user;
  switch (req.method) {
    case "PUT": {
      if ("eventPopulatedInput" in req.body) {
        const result = eventPopulatedInputServerValidator
          .partial()
          .safeParse(req.body?.eventPopulatedInput);
        if (!result.success)
          return res.status(400).json({ error: result.error });

        await eventParent.updateOne(result.data.eventParent);
        delete result.data.eventParent;
        await event.updateOne(result.data);
      } else {
        const result = eventInputServerValidator.safeParse(req.body);
        if (!result.success) return res.status(400).json(result);

        await event.updateOne(result.data);
      }

      if (req.body?.sendConfirmationEmail) {
        const userIds = (await Registration.find({ eventId: event._id })).map(
          (registration) => registration.userId
        );
        const users = await User.find({ _id: { $in: userIds } });
        for (const user of users) {
          await sendEventEditedEmail(user, event, eventParent);
        }
      }

      await createHistoryEventEditEvent(user, event, eventParent);

      return res
        .status(200)
        .json({ event: await event.populate("eventParent") });
    }
    case "DELETE": {
      await Attendance.deleteMany({ eventId: event._id });
      await Registration.deleteMany({ eventId: event._id });
      await event.deleteOne();

      const eventParentId = event.eventParent;
      if ((await Event.count({ eventParent: eventParentId })) === 0) {
        await EventParent.findByIdAndDelete(eventParentId);
      }

      await createHistoryEventDeleteEvent(user, event, eventParent);

      return res.status(204).end();
    }
  }
};
