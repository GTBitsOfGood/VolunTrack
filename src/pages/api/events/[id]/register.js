const { updateEventID } = require("../../../../../server/actions/events");
const User = require("../../../../../server/mongodb/models/User");

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

    if (event.mandated_volunteers.includes(user._id)) {
      await User.updateOne(
        { "bio.email": `${user.bio.email}` },
        { $push: { mandatedEvents: eventId } }
      ).then((result) => {
        if (!result.nModified)
          return {
            status: 400,
            message: {
              error: "Email requested for update was invalid. 0 items changed.",
            },
          };
      });
    }

    res.status(200).json(updatedEvent);
  }
}
