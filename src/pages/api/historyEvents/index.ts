import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import HistoryEvent, {
  HistoryEventData,
} from "../../../../server/mongodb/models/HistoryEvent";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<{ historyEvents: HydratedDocument<HistoryEventData>[] }>
) => {
  switch (req.method) {
    case "GET": {
      const { keyword, description, user, event, organization } =
        req.query as Partial<HistoryEventData>;

      const match: Partial<HistoryEventData> = {};
      if (keyword) match.keyword = keyword;
      if (description) match.description = description;
      if (user) match.user = user;
      if (event) match.event = event;
      if (organization) match.organization = organization;

      return res
        .status(200)
        .json({ historyEvents: await HistoryEvent.find(match) });
    }
  }
};
