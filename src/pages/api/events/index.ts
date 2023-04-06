import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getEvents } from "../../../../server/actions/events";
import dbConnect from "../../../../server/mongodb";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import {
  EventInputData,
  eventInputValidator,
  EventPopulatedInputData,
  eventPopulatedInputValidator,
} from "../../../validators/events";

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
        return res
          .status(400)
          .json({ success: false, error: "Invalid organizationId" });

      return res.status(200).json({
        success: true,
        events: await getEvents(
          new Types.ObjectId(organizationId),
          startDate,
          endDate
        ),
      });
    }
    case "POST": {
      if (req.body?.eventParentId) {
        const result = eventInputValidator.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json(result);
        }

        // Create a one off Event connected to an already existing EventParent
        const eventInputData = req.body as EventInputData;
        const event = await Event.create(eventInputData);

        // TODO: fix these things
        // await scheduler.scheduleNewEventJobs(
        //   event._id,
        //   event.date,
        //   (
        //     await EventParent.findById(event.eventParentId)
        //   )?.endTime!
        // );
        // createHistoryEventCreateEvent(event);

        return res.status(201).json({
          success: true,
          event: await event.populate("eventParentId"),
        });
      }

      if (req.body?.eventParent) {
        const result = eventPopulatedInputValidator.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json(result);
        }

        // Create a new Event and EventParent
        const eventPopulatedInputData = req.body as EventPopulatedInputData;
        const eventParent = await EventParent.create(
          eventPopulatedInputData.eventParent
        );
        const event = await Event.create({
          date: eventPopulatedInputData.date,
          eventParentId: eventParent._id,
        });

        // TODO: fix these things
        // await scheduler.scheduleNewEventJobs(
        //   event._id,
        //   event.date,
        //   eventParent.endTime
        // );
        // createHistoryEventCreateEvent();

        return res.status(201).json({
          success: true,
          event: await event.populate("eventParentId"),
        });
      }

      // Request body has neither eventParentId nor eventParent
      return res.status(400).json({
        success: false,
        error: "Request body has neither eventParentId nor eventParent",
      });
    }
  }
};
