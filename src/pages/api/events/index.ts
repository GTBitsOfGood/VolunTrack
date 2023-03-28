import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getEvents } from "../../../../server/actions/events";
import dbConnect from "../../../../server/mongodb/index";
import Event, {
  EventData,
  EventPopulatedData,
} from "../../../../server/mongodb/models/Event";
import EventParent, {
  EventParentData,
} from "../../../../server/mongodb/models/EventParent";
import {
  CreateEventRequestBody,
  CreateEventResponseData,
} from "../../../actions/queries";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<EventPopulatedData[] | CreateEventResponseData>
) => {
  switch (req.method) {
    case "GET": {
      const { startDateString, endDateString, organizationId } = req.query as {
        [queryParam: string]: string;
      };

      return res
        .status(200)
        .json(
          await getEvents(
            startDateString,
            endDateString,
            new Types.ObjectId(organizationId)
          )
        );
    }
    case "POST": {
      const requestBody = req.body as CreateEventRequestBody;

      await dbConnect();
      if (requestBody.eventParent instanceof Types.ObjectId) {
        // Create a one off Event connected to an already existing EventParent
        const eventData = requestBody as EventData;
        const event = await Event.create(eventData);
        return res.status(201).json({ eventId: event._id });
      } else {
        // Create a new EventParent and an Event, connected to the EventParent
        const eventData = requestBody as Omit<EventData, "eventParent"> & {
          eventParent: EventParentData;
        };
        const eventParent = await EventParent.create(eventData.eventParent);
        const event = await Event.create({
          ...eventData,
          eventParent: eventParent._id,
        });

        return res
          .status(201)
          .json({ eventId: event._id, eventParentId: eventParent._id });
      }
    }
  }
};
