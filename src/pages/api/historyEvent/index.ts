import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../server/mongodb";
import HistoryEvent from "../../../../server/mongodb/models/HistoryEvent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      const historyEvents = await HistoryEvent.find({}).sort("createdAt");
      res.status(200).json(historyEvents);

      break;
    }
    case "POST": {
      const historyEventData = req.body.eventHistory;
      const historyEvent = await HistoryEvent.create(historyEventData);

      if (historyEvent) {
        res.status(200).json(historyEvent);
      }

      break;
    }
  }
};
