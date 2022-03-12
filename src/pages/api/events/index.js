const { validationResult, matchedData } = require("express-validator");
const { CREATE_EVENT_VALIDATOR } = require("../../../../server/validators");
const {
  createEvent,
  getEvents,
  updateEvent,
} = require("../../../../server/actions/events");
const { getEventVolunteers } = require("../../../../server/actions/users");

import initMiddleware from "../../../../lib/init-middleware";
import validateMiddleware from "../../../../lib/validate-middleware";
import { sendEmail } from "../../../utils/mailchimp";

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
    await validateBody(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const updateEventData = matchedData(req);

    let event = await updateEvent(updateEventData, next);

    const eventVolunteers = await getEventVolunteers(event.volunteers);
    const eventVolunteerEmails = eventVolunteers.message.users.map(
      (user) => user.bio.email
    );
    const formattedEventVolunteerEmails = eventVolunteerEmails.map(
      (userEmail) => ({ email: userEmail })
    );

    const emailTemplateVariables = [
      {
        name: "eventTitle",
        content: `${event.title}`,
      },
    ];

    await sendEmail(
      formattedEventVolunteerEmails,
      "event-update",
      emailTemplateVariables
    );

    res.json({
      event,
    });
  } else {
    res.status(404).json({ message: "Invalid Request Method" });
  }
}
