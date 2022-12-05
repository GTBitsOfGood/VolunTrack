import { NextApiRequest, NextApiResponse } from "next";
import {
  createHistoryEvent,
  getAllHistoryEvents,
} from "../../../../server/actions/historyEvent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const historyEvents = await getAllHistoryEvents();

      res.status(200).json(historyEvents);

      break;
    }
    case "POST": {
      const historyEvent = createHistoryEvent(req.body.eventHistory);

      if (historyEvent) {
        res.status(200).json(historyEvent);
      }

      break;
    }
  }
};
