import { sendRegistrationConfirmationEmail } from "../../../../utils/mailersend-email";

const { updateEventID } = require("../../../../../server/actions/events");

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const eventId = req.query.id;
    const event = req.body.event;
    const user = req.body.user;

    const updatedEvent = await updateEventID(eventId, event, next).then(() =>
      sendRegistrationConfirmationEmail(user, event)
    );

    res.status(200).json(updatedEvent);
  }
}
