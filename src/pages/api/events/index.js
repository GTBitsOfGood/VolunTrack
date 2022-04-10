const { validationResult, matchedData } = require("express-validator");
const { CREATE_EVENT_VALIDATOR } = require("../../../../server/validators");
const {
  createEvent,
  getEvents,
  updateEvent,
} = require("../../../../server/actions/events");

import { ObjectId } from "mongodb";
import initMiddleware from "../../../../lib/init-middleware";
import validateMiddleware from "../../../../lib/validate-middleware";
import { agenda } from "../../../../server/jobs";
import { scheduler } from "../../../../server/jobs/scheduler";
import { sendEventEmail } from "../../../utils/email.ts";

const validateBody = initMiddleware(
  validateMiddleware(CREATE_EVENT_VALIDATOR, validationResult)
);

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    let events = await getEvents(req.query.startDate, req.query.endDate, next);

    return res.status(200).json({
      events,
    });
  } else if (req.method === "POST") {
    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const newEventData = matchedData(req);

    await createEvent(newEventData, next);

    res.json({
      message: "Event successfully created!",
    });
  } else if (req.method === "PUT") {

    const sendConfirmationEmail = req.body.sendConfirmationEmail;

    req.body = req.body.event;

    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const updateEventData = matchedData(req);

    let event = await updateEvent(updateEventData, next);

    await agenda.start();
    await agenda.cancel({ data: new ObjectId(event._id) });
    await scheduler.scheduleNewEventJobs(event);

    const emailTemplateVariables = [
      {
        name: "eventTitle",
        content: `${event.title}`,
      },
    ];
    if (sendConfirmationEmail) {
      await sendEventEmail(event, "event-update", emailTemplateVariables);
    }

    res.json({
      event,
    });
  } else {
    res.status(404).json({ message: "Invalid Request Method" });
  }
}
