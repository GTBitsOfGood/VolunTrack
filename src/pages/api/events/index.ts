import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getEvents } from "../../../../server/actions/events";
import { createHistoryEventCreateEvent } from "../../../../server/actions/historyEvent";
import { scheduler } from "../../../../server/jobs/scheduler";
import dbConnect from "../../../../server/mongodb";
import Event, {
  EventData,
  EventPopulatedData,
  eventPopulatedValidator,
  eventValidator,
} from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const organizationId = req.query.organizationId as string;
      const startDateString = req.query.startDateString as string | undefined;
      const endDateString = req.query.endDateString as string | undefined;

      const startDate =
        startDateString !== undefined ? new Date(startDateString) : undefined;
      const endDate =
        endDateString !== undefined ? new Date(endDateString) : undefined;

      // TODO: validate date strings

      if (!isValidObjectId(organizationId))
        return res.status(400).json({ message: "Invalid organizationId" });

      return res.status(200).json({
        events: await getEvents(
          new Types.ObjectId(organizationId),
          startDate,
          endDate
        ),
      });
    }
    case "POST": {
      if (eventPopulatedValidator.safeParse(req.body).success) {
        // Create a new Event and EventParent
        const eventPopulatedData = req.body as EventPopulatedData;
        const eventParent = await EventParent.create(
          eventPopulatedData.eventParent
        );
        const event = await Event.create({
          ...eventPopulatedData,
          eventParent: eventParent._id,
        });

        await scheduler.scheduleNewEventJobs(event);
        createHistoryEventCreateEvent(event);

        return res
          .status(201)
          .json({ event: await event.populate("eventParent") });
      }

      if (eventValidator.safeParse(req.body).success) {
        // Create a one off Event connected to an already existing EventParent
        const eventData = req.body as EventData;
        const event = await Event.create(eventData);

        await scheduler.scheduleNewEventJobs(event);
        createHistoryEventCreateEvent(event);

        return res
          .status(201)
          .json({ event: await event.populate("eventParent") });
      }

      return res.status(400).json({ message: "Invalid event data format" });
    }
  }
};
