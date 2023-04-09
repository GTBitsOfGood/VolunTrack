import Organization from "../../server/mongodb/models/Organization";

const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export const sendRegistrationConfirmationEmail = async (user, event) => {
  const organization = await Organization.findById(user.organizationId).lean();

  const personalization = [
    {
      email: user.email,
      data: {
        header: `Your Registration is Confirmed for ${event.title}`,
        introLine: `Thanks for registering for ${event.title}! Please review the event details below.`,
        eventTitle: event.title,
        volunteerName: user.firstName,
        eventDate: event.date?.slice(0, 10),
        eventStartTime: convertTime(event.startTime),
        eventEndTime: convertTime(event.endTime),
        eventLocale: event.localTime,
        eventAddress: event.address,
        eventCity: event.city,
        eventState: event.state,
        eventZipCode: event.zip,
        eventDescription: event.description?.replace(/<[^>]+>/g, " "),
        eventContactEmail: event.eventContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];

  sendEmail(user, personalization, `Registration Confirmed for ${event.title}`);
};

export const sendResetCodeEmail = async (user, email, code) => {
  const organization = await Organization.findById(user.organizationId).lean();

  console.log(user);
  
  const personalization = [
    {
      email: email,
      data: {
        volunteerName: user.bio.first_name,
        code: code,
        link: "https://volunteer.bitsofgood.org/passwordreset/" + code,
        eventContactEmail: organization.defaultContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];

  sendResetEmail(user, personalization, `Password Reset Request`);
};

export const sendEventEditedEmail = async (user, event) => {
  let nonprofit = await Organization.findById(user.organizationId).lean().name;

  const personalization = [
    {
      email: user.email,
      data: {
        header: `${nonprofit} edited ${event.title}`,
        introLine: `It looks like an admin at ${nonprofit} edited ${event.title}! 
        Please review the event details below and ensure they still work with your schedule.`,
        eventTitle: event.title,
        volunteerName: user.firstName,
        eventDate: event.date?.slice(0, 10),
        eventStartTime: convertTime(event.startTime),
        eventEndTime: convertTime(event.endTime),
        eventLocale: event.localTime,
        eventAddress: event.address,
        eventCity: event.city,
        eventState: event.state,
        eventZipCode: event.zip,
        eventDescription: event.description?.replace(/<[^>]+>/g, " "),
        eventContactEmail: event.eventContactEmail,
        nonprofitName: nonprofit,
      },
    },
  ];
  sendEmail(user, personalization, `${event.title} has been updated`);
};

const sendResetEmail = async (user, personalization, subject) => {
  let organization = await Organization.findById(user.organizationId).lean();

  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [
    new Recipient(user.email, `${user.firstName} ${user.lastName}`),
  ];

  const emailParams = new EmailParams()
    .setFrom(personalization[0].data.eventContactEmail)
    .setFromName(organization.name)
    .setRecipients(recipients)
    .setSubject(subject)
    .setTemplateId("x2p03479p5pgzdrn")
    .setPersonalization(personalization);

  mailersend.send(emailParams).then((error) => {
    console.log(error);
  });
};

const sendEmail = async (user, personalization, subject) => {
  let organization = await Organization.findById(user.organizationId).lean();

  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  const recipients = [
    new Recipient(user.email, `${user.firstName} ${user.lastName}`),
  ];

  const emailParams = new EmailParams()
    .setFrom(personalization[0].data.eventContactEmail)
    .setFromName(organization.name)
    .setRecipients(recipients)
    .setSubject(subject)
    .setBcc(organization.notificationEmail)
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
