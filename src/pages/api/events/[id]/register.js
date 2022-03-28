const { updateEventID } = require("../../../../../server/actions/events");

import { sendUserEmail } from "../../../../utils/email";

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const eventId = req.query.id;
    const event = req.body.event;
    const user = req.body.user;

    const updatedEvent = await updateEventID(eventId, event, next);

    const emailTemplateVariables = [
      {
        name: "eventTitle",
        content: `${event.title}`,
      },
    ];

    await sendUserEmail(
      user.bio.email,
      "event-register-confirmation",
      emailTemplateVariables
    );

    res.status(200).json(updatedEvent);
  }
}
