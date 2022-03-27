const { updateEventID } = require("../../../../../server/actions/events");
const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_API_KEY
);

export default async function handler(req, res, next) {
  if (req.method === "POST") {
    const eventId = req.query.id;
    const event = req.body.event;
    const user = req.body.user;

    const updatedEvent = await updateEventID(eventId, event, next);

    await mailchimp.messages.sendTemplate({
      template_name: "event-register-confirmation",
      template_content: [],
      message: {
        to: [{ email: `${user.bio.email}` }],
        global_merge_vars: [
          {
            name: "eventTitle",
            content: `${event.title}`,
          },
        ],
      },
    });

    res.status(200).json(updatedEvent);
  }
}
