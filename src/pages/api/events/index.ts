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

import { RRule, Weekday } from "rrule";
import { isAdmin } from "../../../utils/routeProtection";

/* Recurring Events */

const rruleTypeMapping: { [key: string]: number } = {
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
  annually: RRule.YEARLY,
};

const rruleDayMapping: Weekday[] = [
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
  RRule.SU,
];

const dayMapping: string[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const generateRRule = (result: any) => {
  const startDate: Date = result.data.date;
  const endDate: Date = new Date(
    new Date(startDate).setFullYear(startDate.getFullYear() + 5)
  );

  if (result.data.recurringEvent === "daily") {
    const rule = new RRule({
      freq: rruleTypeMapping[result.data.recurringEvent],
      dtstart: startDate,
      until: endDate,
    });
    return rule;
  } else if (result.data.recurringEvent === "weekly") {
    const rule = new RRule({
      freq: rruleTypeMapping[result.data.recurringEvent],
      byweekday: [rruleDayMapping[startDate.getDay()]],
      dtstart: startDate,
      until: endDate,
    });
    return rule;
  } else if (result.data.recurringEvent === "monthly") {
    let day = startDate.getDate(),
      cnt = 0;
    while (day > 0) {
      day -= 7;
      cnt++;
    }
    const rule = new RRule({
      bysetpos: cnt,
      freq: rruleTypeMapping[result.data.recurringEvent],
      byweekday: rruleDayMapping[startDate.getDay()],
      dtstart: startDate,
      until: endDate,
    });
    return rule;
  } else if (result.data.recurringEvent === "annually") {
    const date =
      (Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ) -
        Date.UTC(startDate.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000;
    const rule = new RRule({
      freq: rruleTypeMapping[result.data.recurringEvent],
      byyearday: date,
      dtstart: startDate,
      until: endDate,
    });
    return rule;
  } else return null;
};

const generateCustomRRule = (result: any) => {
  const settings: { [key: string]: any } = result.data.customRecurrenceSettings;
  const startDate: Date = result.data.date;
  let endCondition;
  if (settings.recurrenceEndType === "On") {
    endCondition = {
      until: settings.recurrenceEndDate,
    };
  } else if (settings.recurrenceEndType === "After") {
    endCondition = {
      count: settings.recurrenceEndOccurences,
    };
  } else {
    endCondition = {
      until: new Date(
        new Date(startDate).setFullYear(startDate.getFullYear() + 5)
      ),
    };
  }

  const addConditions = {
    interval: settings.recurrenceNumber,
    dtstart: startDate,
  };

  let weekDayCondition = {};
  if (settings.recurrenceDays.length > 0)
    weekDayCondition = {
      byweekday: (settings.recurrenceDays as string[]).map(
        (day: string) => rruleDayMapping[dayMapping.indexOf(day)]
      ),
    };

  if (["day", "days"].includes(settings.recurrenceChoice as string)) {
    const rule = new RRule({
      freq: RRule.DAILY,
      ...addConditions,
      ...weekDayCondition,
      ...endCondition,
    });
    return rule;
  } else if (["week", "weeks"].includes(settings.recurrenceChoice as string)) {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      ...addConditions,
      ...weekDayCondition,
      ...endCondition,
    });
    return rule;
  } else if (
    ["month", "months"].includes(settings.recurrenceChoice as string)
  ) {
    const rule = new RRule({
      freq: RRule.MONTHLY,
      ...addConditions,
      ...weekDayCondition,
      ...endCondition,
    });
    return rule;
  } else if (["year", "years"].includes(settings.recurrenceChoice as string)) {
    const date =
      (Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ) -
        Date.UTC(startDate.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000;
    if (settings.recurrenceDays.length > 0) {
      weekDayCondition = {
        byyearday: date,
      };
    }
    const rule = new RRule({
      freq: RRule.YEARLY,
      ...addConditions,
      ...weekDayCondition,
      ...endCondition,
    });
    return rule;
  }
  return null;
};

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
      try {
        if (!isValidObjectId(organizationId))
          return res.status(400).json({ error: "Invalid organizationId" });

        const events = await getEvents(new Types.ObjectId(organizationId));
        return res.status(200).json({
          events: await getEvents(
            new Types.ObjectId(organizationId),
            startDate,
            endDate
          ),
        });
      } catch (error: any) {
        console.error("Error fetching events:", error);
        return res.status(500).json({
          error: error.message || "Internal Server Error",
        });
      }
    }
    case "POST": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res.status(403).json({ error: "Only admins can create events" });
      }
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

        const user = session.user;

        if (result.data.recurringEvent === "dnr") {
          const event = await Event.create({
            date: result.data.date,
            eventParent: eventParent._id,
          });

          await createHistoryEventCreateEvent(user, event, eventParent);

          return res.status(201).json({
            event: await event.populate("eventParent"),
          });
        } else if (result.data.recurringEvent in rruleTypeMapping) {
          const rule = generateRRule(result);
          if (!rule)
            return res
              .status(400)
              .json({ error: "Invalid Recurring Event Type" });

          for (const date of rule.all()) {
            const event = await Event.create({
              date: new Date(date),
              eventParent: eventParent._id,
            });

            await createHistoryEventCreateEvent(user, event, eventParent);

            await event.populate("eventParent");
          }
          return res.status(201).json({});
        } else if (result.data.recurringEvent === "custom") {
          const rule = generateCustomRRule(result);
          if (!rule)
            return res
              .status(400)
              .json({ error: "Invalid Recurring Event Type" });
          for (const date of rule.all()) {
            const event = await Event.create({
              date: new Date(date),
              eventParent: eventParent._id,
            });
            await createHistoryEventCreateEvent(user, event, eventParent);
            await event.populate("eventParent");
          }
          return res.status(201).json({});
        } else {
          return res
            .status(400)
            .json({ error: "Invalid Recurring Event Type" });
        }

        // TODO: fix these things
        // await scheduler.scheduleNewEventJobs(
        //   event._id,
        //   event.date,
        //   eventParent.endTime
        // );
        // createHistoryEventCreateEvent();

        return res.status(201);
      }

      // Request body has neither eventParentId nor eventParent
      return res.status(400).json({
        error: "Request body has neither eventParentId nor eventParent",
      });
    }
  }
};
