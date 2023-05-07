import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import HistoryEvent from "../../../../server/mongodb/models/HistoryEvent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // const keyword = req.query.keyword
      //   ? (req.query.keyword as string)
      //   : undefined;
      // const description = req.query.description
      //   ? (req.query.description as string)
      //   : undefined;
      //
      // if (req.query.userId && !isValidObjectId(req.query.userId as string))
      //   return res.status(400).json({
      //     error: `User id of ${req.query.userId as string} is invalid`,
      //   });
      // if (req.query.eventId && !isValidObjectId(req.query.eventId as string))
      //   return res.status(400).json({
      //     error: `Event id of ${req.query.eventId as string} is invalid`,
      //   });
      if (
        req.query.organizationId &&
        !isValidObjectId(req.query.organizationId as string)
      )
        return res.status(400).json({
          error: `Organization id of ${
            req.query.organizationId as string
          } is invalid`,
        });

      // const userId = req.query.userId
      //   ? new Types.ObjectId(req.query.userId as string)
      //   : undefined;
      // const eventId = req.query.eventId
      //   ? new Types.ObjectId(req.query.eventId as string)
      //   : undefined;
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      // const match: Partial<HistoryEventData> = {};
      // if (keyword) match.keyword = keyword;
      // if (description) match.description = description;
      // if (userId) match.userId = userId;
      // if (event) match.eventId = eventId;
      // if (organizationId) match.organizationId = organizationId;

      return res.status(200).json({
        historyEvents: await HistoryEvent.find({ organizationId }),
      });
    }
  }
};
