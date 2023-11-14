import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import { createHistoryEventCreateEvent } from "../../../../server/actions/historyEvent";
import { getEvents } from "../../../../server/actions/events";
import dbConnect from "../../../../server/mongodb";
import Event, {
  eventInputServerValidator,
  eventPopulatedInputServerValidator,
} from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import { authOptions } from "../auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const organizationId = req.query.organizationId as string;
      const startDateString = req.query.startDateString as string | undefined;
      const endDateString = req.query.endDateString as string | undefined;

      const startDate = startDateString ? new Date(startDateString) : undefined;
      const endDate = endDateString ? new Date(endDateString) : undefined;

      // TODO: validate date strings

      if (!isValidObjectId(organizationId))
        return res.status(400).json({ error: "Invalid organizationId" });

      return res.status(200).json({
        events: await getEvents(
          new Types.ObjectId(organizationId),
          startDate,
          endDate
        ),
      });
    }
    case "POST": {
      if (req.body?.eventParentId) {
        const result = eventInputServerValidator.safeParse(req.body);
        if (!result.success) return res.status(400).json(result);

        const event = await Event.create({
          date: result.data.date,
          eventParent: result.data.eventParentId,
        });

        // TODO: fix these things
        // await scheduler.scheduleNewEventJobs(
        //   event._id,
        //   event.date,
        //   (
        //     await EventParent.findById(event.eventParentId)
        //   )?.endTime!
        // );
        // createHistoryEventCreateEvent(event);

        return res.status(201).json({ event });
      } else if (req.body?.eventParent) {
        const result = eventPopulatedInputServerValidator.safeParse(req.body);
        if (!result.success)
          return res.status(400).json({ error: result.error });

        const session = await getServerSession(req, res, authOptions);
        if (!session?.user)
          return res
            .status(400)
            .json({ error: "User session not found to create event" });
        const eventParent = await EventParent.create(result.data.eventParent);

        const event = await Event.create({
          date: result.data.date,
          eventParent: eventParent._id,
        });
        if (
          !eventParent.isRecurring.includes(true) &&
          eventParent.recurrenceEndDate
        ) {
          let currDate = event.date;
          const recurrence = eventParent.isRecurring;
          let recurringEvents = [];
          while (currDate < eventParent.recurrenceEndDate) {
            for (let i = 0; i < recurrence.length; i++) {
              if (recurrence[i] === true) {
                const recurringEvent = await Event.create({
                  date: result.data.date,
                  eventParent: eventParent._id,
                });
                recurringEvents.push(recurringEvent);
              }
              currDate.setDate(currDate.getDate() + 1);
            }
          }
        }

        const user = session.user;
        await createHistoryEventCreateEvent(user, event, eventParent);

        // TODO: fix these things
        // await scheduler.scheduleNewEventJobs(
        //   event._id,
        //   event.date,
        //   eventParent.endTime
        // );
        // createHistoryEventCreateEvent();

        return res.status(201).json({
          event: await event.populate("eventParent"),
        });
      }

      // Request body has neither eventParentId nor eventParent
      return res.status(400).json({
        error: "Request body has neither eventParentId nor eventParent",
      });
    }
  }
};
