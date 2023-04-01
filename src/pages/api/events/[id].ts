import { NextApiRequest, NextApiResponse } from "next/types";
import {
  createHistoryEventDeleteEvent,
  createHistoryEventEditEvent,
} from "../../../../server/actions/historyEvent";
import { agenda } from "../../../../server/jobs";
import { scheduler } from "../../../../server/jobs/scheduler";
import dbConnect from "../../../../server/mongodb";
import Attendance from "../../../../server/mongodb/models/Attendance";
import Event, {
  EventData,
  EventPopulatedData,
  eventPopulatedValidator,
  eventValidator,
} from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import User from "../../../../server/mongodb/models/User";
import { sendEventEditedEmail } from "../../../utils/mailersend-email.js";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const eventId = req.query.id as string;

  const event = await Event.findById(eventId);
  if (!event) {
    return res
      .status(404)
      .json({ message: `Event with id ${eventId} not found` });
  }

  switch (req.method) {
    case "GET": {
      return res
        .status(200)
        .json({ event: await event.populate("eventParent") });
    }
    case "PUT": {
      const requestBody = req.body as {
        eventData: Partial<EventPopulatedData> | Partial<EventData>;
        sendConfirmationEmail: boolean;
      };

      if (eventPopulatedValidator.safeParse(requestBody.eventData).success) {
        const eventData = requestBody.eventData as EventPopulatedData;
        const eventParentId = event.eventParentId;
        await EventParent.findByIdAndUpdate(
          eventParentId,
          eventData.eventParent
        );
        await event.updateOne({
          ...eventData,
          eventParent: eventParentId,
        });
      } else if (eventValidator.safeParse(requestBody.eventData).success) {
        const eventData = requestBody.eventData as EventData;
        await event.updateOne(eventData);
      }

      if (requestBody.sendConfirmationEmail) {
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
      await scheduler.scheduleNewEventJobs(event);
      createHistoryEventEditEvent(requestBody.eventData);

      return res
        .status(200)
        .json({ event: await event.populate("eventParent") });
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
      createHistoryEventDeleteEvent(eventId);

      return res.status(200);
    }
  }
};
