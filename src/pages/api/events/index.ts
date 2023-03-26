import { NextApiRequest, NextApiResponse } from "next/types";
import { createEvent, getEvents } from "../../../../server/actions/events";
import { eventTypeSchema } from "../../../../server/mongodb/models/Event";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return await getEvents(
        req.query.startDate as string,
        req.query.endDate as string,
        req.query.organizationId as string
      );

    case "POST":
      const validationResult = await eventTypeSchema.spa(req.body);
      if (!validationResult.success) {
        return res.status(400).json(validationResult.error);
      }

      const eventData = validationResult.data;
      const event = await createEvent(eventData);

      return res.status(201).json(event.id);
  }
};
