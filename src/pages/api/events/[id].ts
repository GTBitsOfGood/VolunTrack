/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next/types";
import {
  createHistoryEventDeleteEvent,
  createHistoryEventEditEvent,
} from "../../../../server/actions/historyEvent";
import { agenda } from "../../../../server/jobs";
import { scheduler } from "../../../../server/jobs/scheduler";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import User from "../../../../server/mongodb/models/User";
import { sendEventEditedEmail } from "../../../utils/mailersend-email.js";
import {
  eventInputValidator,
  eventPopulatedInputValidator,
} from "../../../validators/events";
import { authOptions } from "../auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res
      .status(400)
      .json({ success: false, error: "User session not found" });
  const user = session.user;

  const eventId = req.query.id as string;

  const event = await Event.findById(eventId);
  if (!event)
    return res
      .status(404)
      .json({ success: false, error: `Event with id ${eventId} not found` });

  const eventParent = await EventParent.findById(event.eventParentId);
  if (!eventParent)
    return res.status(404).json({
      success: false,
      error: `Event with id ${eventId} has no EventParent`,
    });

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ success: true, event: await event.populate("eventParentId") });
    }
    case "PUT": {
      if (!("eventParent" in req.body?.eventData)) {
        const result = eventInputValidator.partial().safeParse(req.body);
        if (!result.success) return res.status(400).json(result);

        await event.updateOne(result.data);
      } else {
        const result = eventPopulatedInputValidator.safeParse(req.body);
        if (!result.success) return res.status(400).json(result);

        await eventParent.updateOne(result.data.eventParent);
        await event.updateOne({
          ...result.data,
          eventParent: eventParent?._id,
        });
      }

      if (req.body?.sendConfirmationEmail) {
        const userIds = (await Registration.find({ eventId: event._id })).map(
          (registration) => registration.userId
        );
        const users = await User.find({ _id: { $in: userIds } });
        for (const user of users) {
          await sendEventEditedEmail(user.email, event);
        }
      }

      await agenda.start();
      await agenda.cancel({ data: event._id });
      await scheduler.scheduleNewEventJobs(
        event._id,
        event.date,
        eventParent.endTime
      );
      await createHistoryEventEditEvent(user._id, event, eventParent);

      return res
        .status(200)
        .json({ success: true, event: await event.populate("eventParentId") });
    }
    case "DELETE": {
      await Attendance.deleteMany({ eventId: event._id });
      await Registration.deleteMany({ eventId: event._id });
      await event.deleteOne();

      const eventParentId = event.eventParentId;
      if ((await Event.count({ eventParentId: eventParentId })) === 0) {
        await EventParent.findByIdAndDelete(eventParentId);
      }

      await agenda.start();
      await agenda.cancel({ data: event._id });
      await createHistoryEventDeleteEvent(user._id, event, eventParent);

      return res.status(200).json({ success: true });
    }
  }
};