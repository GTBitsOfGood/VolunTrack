const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export const sendRegistrationConfirmationEmail = async (user, event) => {
  const personalization = [
    {
      email: user.bio.email,
      data: {
        header: "Your Registration is Confirmed for",
        introLine: `Thanks for registering for ${event.title}! Please review the event details below.`,
        eventTitle: event.title,
        volunteerName: user.bio.first_name,
        eventDate: event.date.slice(0, 10),
        eventStartTime: convertTime(event.startTime),
        eventEndTime: convertTime(event.endTime),
        eventLocale: event.localTime,
        eventAddress: event.address,
        eventCity: event.city,
        eventState: event.state,
        eventZipCode: event.zip,
        eventDescription: event.description.replace(/<[^>]+>/g, " "),
        eventContactEmail: event.eventContactEmail,
        nonprofitName: "Helping Mamas", // TODO: change when we switch to multi tenant model
      },
    },
  ];

  sendEmail(
    user,
    personalization,
    `Registration Confirmed for ${event.title}`
  );
};

export const sendEventEditedEmail = async (user, event) => {
  const nonprofit = "Helping Mamas"; // TODO: change when we switch to multi tenant model
  const personalization = [
    {
      email: user.bio.email,
      data: {
        header: `${nonprofit} edited`,
        introLine: `It looks like an admin at ${nonprofit} edited ${event.title}! 
        Please review the event details below and ensure they still work with your schedule.`,
        eventTitle: event.title,
        volunteerName: user.bio.first_name,
        eventDate: event.date.slice(0, 10),
        eventStartTime: convertTime(event.startTime),
        eventEndTime: convertTime(event.endTime),
        eventLocale: event.localTime,
        eventAddress: event.address,
        eventCity: event.city,
        eventState: event.state,
        eventZipCode: event.zip,
        eventDescription: event.description.replace(/<[^>]+>/g, " "),
        eventContactEmail: event.eventContactEmail,
        nonprofitName: nonprofit,
      },
    },
  ];
  sendEmail(user, personalization, `${event.title} has been updated`);
};

const sendEmail = async (user, personalization, subject) => {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [
    new Recipient(
      user.bio.email,
      user.bio.first_name + " " + user.bio.last_name
    ),
  ];

  const emailParams = new EmailParams()
    .setFrom("volunteer@bitsofgood.org")
    .setFromName("Bits of Good") // TODO: change when we switch to multi tenant model
    .setRecipients(recipients)
    .setSubject(subject)
    .setTemplateId("vywj2lpov8p47oqz")
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
