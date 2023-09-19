import Organization from "../../server/mongodb/models/Organization";
import Event from "../../server/mongodb/models/Event";
import User from "../../server/mongodb/models/User";

const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export const sendRegistrationConfirmationEmail = async (userId, eventId) => {
  const user = await User.findById(userId).lean();
  const event = await Event.findById(eventId).populate("eventParent").lean();
  const organization = await Organization.findById(user.organizationId).lean();

  const personalization = [
    {
      email: user.email,
      data: {
        header: `Your Registration is Confirmed for ${event.eventParent.title}`,
        introLine: `Thanks for registering for ${event.eventParent.title}! Please review the event details below.`,
        eventTitle: event.eventParent.title,
        volunteerName: user.firstName,
        eventDate: event.date?.toISOString().slice(0, 10),
        eventStartTime: convertTime(event.eventParent.startTime),
        eventEndTime: convertTime(event.eventParent.endTime),
        eventLocale: event.eventParent.localTime,
        eventAddress: event.eventParent.address,
        eventCity: event.eventParent.city,
        eventState: event.eventParent.state,
        eventZipCode: event.eventParent.zip,
        eventDescription: event.eventParent.description?.replace(
          /<[^>]+>/g,
          " "
        ),
        eventContactEmail: event.eventParent.eventContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];

  sendEmail(
    user,
    organization,
    personalization,
    `Registration Confirmed for ${event.eventParent.title}`
  );
};

export const sendResetCodeEmail = async (user, email, code) => {
  const organization = await Organization.findById(user.organizationId).lean();

  const personalization = [
    {
      email: email,
      data: {
        // TO DO: change this
        volunteerName: user.firstName,
        code: code,
        link: "https://volunteer.bitsofgood.org/passwordreset/" + code,
        eventContactEmail: organization.defaultContactEmail
          ? organization.defaultContactEmail
          : "hello@bitsofgood.org",
        nonprofitName: organization.name,
      },
    },
  ];

  sendEmail(
    user,
    organization,
    personalization,
    `Password Reset Request`,
    "x2p03479p5pgzdrn"
  );
};

export const sendEventEditedEmail = async (user, event, eventParent) => {
  let organization = await Organization.findById(user.organizationId).lean();

  const personalization = [
    {
      email: user.email,
      data: {
        header: `${organization.name} edited ${eventParent.title}`,
        introLine: `It looks like an admin at ${organization.name} edited ${eventParent.title}! 
        Please review the event details below and ensure they still work with your schedule.`,
        eventTitle: eventParent.title,
        volunteerName: user.firstName,
        eventDate: event.date?.toISOString().slice(0, 10),
        eventStartTime: convertTime(eventParent.startTime),
        eventEndTime: convertTime(eventParent.endTime),
        eventLocale: eventParent.localTime,
        eventAddress: eventParent.address,
        eventCity: eventParent.city,
        eventState: eventParent.state,
        eventZipCode: eventParent.zip,
        eventDescription: eventParent.description?.replace(/<[^>]+>/g, " "),
        eventContactEmail: eventParent.eventContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];
  sendEmail(
    user,
    organization,
    personalization,
    `${eventParent.title} has been updated`
  );
};

// templates: "vywj2lpov8p47oqz" = standard one, "x2p03479p5pgzdrn" = reset password
const sendEmail = async (
  user,
  organization,
  personalization,
  subject,
  template = "vywj2lpov8p47oqz"
) => {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [
    new Recipient(user.email, `${user.firstName} ${user.lastName}`),
  ];

  const emailParams = new EmailParams()
    .setFrom("volunteer@bitsofgood.org") // IMPORTANT: this email can not change
    .setFromName(organization.name)
    .setRecipients(recipients)
    .setSubject(subject)
    .setBcc([new Recipient(organization.notificationEmail)])
    .setTemplateId(template)
    .setPersonalization(personalization);

  mailersend.send(emailParams).then((error) => {
    console.log(error);
  });
};

const convertTime = (time) => {
  let [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ["pm", "am", "PM", "AM"])) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};
