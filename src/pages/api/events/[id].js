const {
  deleteEventID,
  updateEventID,
  getEventByID,
} = require("../../../../server/actions/events");
const { isValidObjectID } = require("../../../../server/validators");

import { sendEventEmail } from "../../../utils/email";

export default async function handler(req, res, next) {
  if (req.method === "GET") {
    const id = req.query.id;
    if (!isValidObjectID(id)) {
      res.status(400).json({ error: "Object ID not valid" });
    }

    let event = await getEventByID(id, next);
    return res.status(200).json({
      event,
    });
  } else if (req.method === "DELETE") {
    //const id = req.params.id;
    // for some reason after migration, the id ends up in req.query???
    // i have no idea why
    const id = req.query.id;
    if (!isValidObjectID(id)) {
      res.status(400).json({ error: "Object ID not valid" });
    }

    const event = await getEventByID(id, next);

    await deleteEventID(id, next);

    const emailTemplateVariables = [
      {
        name: "eventTitle",
        content: `${event.title}`,
      },
    ];
    await sendEventEmail(event, "event-delete", emailTemplateVariables);

    res.json({
      message: "Event successfully deleted!",
    });
  } else if (req.method === "PUT") {
    const eventID = req.query.id;
    const event = req.body;

    const updatedEvent = await updateEventID(eventID, event);

    res.status(200).json(updatedEvent);
  }
}
