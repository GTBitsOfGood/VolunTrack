import { sendEventEditedEmail } from "../../../utils/mailersend-email";

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
import { getUserFromId } from "../../../../server/actions/users";
import { agenda } from "../../../../server/jobs";
import { scheduler } from "../../../../server/jobs/scheduler";

const validateBody = initMiddleware(
  validateMiddleware(CREATE_EVENT_VALIDATOR, validationResult)
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const events = await getEvents(
      req.query.startDate,
      req.query.endDate,
      req.query.organizationId
    );

    return res.status(200).json({
      events,
    });
  } else if (req.method === "POST") {
    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const newEventData = matchedData(req, { includeOptionals: true });

    await createEvent(newEventData);

    res.json({
      message: "Event successfully created!",
    });
  } else if (req.method === "PUT") {
    let sendConfirmationEmail = req.body.sendConfirmationEmail;
    req.body = req.body.event;

    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const updateEventData = matchedData(req);

    let event = await updateEvent(updateEventData);

    if (sendConfirmationEmail) {
      for (let userId of event.volunteers) {
        if (ObjectId.isValid(userId)) {
          let resp = await getUserFromId(userId);
          if (resp && resp.message.user)
            sendEventEditedEmail(resp.message.user, req.body);
        }
      }
    }

    await agenda.start();
    await agenda.cancel({ data: new ObjectId(event._id) });
    await scheduler.scheduleNewEventJobs(event);

    res.json({
      event,
    });
  } else {
    res.status(404).json({ message: "Invalid Request Method" });
  }
}
