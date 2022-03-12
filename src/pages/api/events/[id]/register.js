const { updateEventID } = require("../../../../../server/actions/events");

import { sendEmailWithTemplate } from "../../../../utils/mailchimp";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const eventId = req.query.id;
    const event = req.body.event;
    const user = req.body.user;

    const updatedEvent = await updateEventID(eventId, event, next);

    const templateVariables = [
      {
        name: "eventTitle",
        content: `${event.title}`,
      },
    ];

    console.log("testing");

    await sendEmailWithTemplate(
      user.bio.email,
      "event-register-confirmation",
      templateVariables
    );

    res.status(200).json(updatedEvent);
  }
}
