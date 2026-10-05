import Organization from "../../server/mongodb/models/Organization";
import Event from "../../server/mongodb/models/Event";
import User from "../../server/mongodb/models/User";

const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

// Load the information shared by all registration emails.
const getRegistrationEmailContext = async (userId, eventId) => {
  const user = await User.findById(userId).lean();
  const event = await Event.findById(eventId).populate("eventParent").lean();

  if (!user || !event?.eventParent) {
    throw new Error("Registration email user or event not found");
  }

  const organization = await Organization.findById(user.organizationId).lean();
  if (!organization) {
    throw new Error("Registration email organization not found");
  }

  return { user, event, organization };
};

const getRegistrationEmailData = ({ user, event, organization }) => ({
  eventTitle: event.eventParent.title,
  memberName: user.firstName,
  eventDate: event.date.toISOString().slice(0, 10),
  eventStartTime: convertTime(event.eventParent.startTime),
  eventEndTime: convertTime(event.eventParent.endTime),
  eventLocale: event.eventParent.localTime,
  eventAddress: event.eventParent.address,
  eventCity: event.eventParent.city,
  eventState: event.eventParent.state,
  eventZipCode: event.eventParent.zip,
  eventDescription: event.eventParent.description?.replace(/<[^>]+>/g, " "),
  eventContactEmail: event.eventParent.eventContactEmail,
  nonprofitName: organization.name,
});

// Send one message using the existing MailerSend template and BCC behavior.
const sendRegistrationEmail = async (
  context,
  recipient,
  { header, introLine, subject }
) => {
  const personalization = [
    {
      email: recipient.email,
      data: {
        ...getRegistrationEmailData(context),
        header,
        introLine,
      },
    },
  ];

  await sendEmail([recipient], context.organization, personalization, subject);
};

// The event contact is the admin recipient used by the existing flow.
const getRegistrationAdminRecipient = (event) => ({
  email: event.eventParent.eventContactEmail,
  firstName: event.eventParent.pocName,
  lastName: "",
});

// Preserve existing behavior for registrations that are approved immediately.
// Admin decisions use the separate approval helper to avoid another admin alert.
export const sendRegistrationConfirmationEmail = async (userId, eventId) => {
  const context = await getRegistrationEmailContext(userId, eventId);
  const { user, event } = context;
  const title = event.eventParent.title;

  const notifications = [
    sendRegistrationEmail(context, user, {
      header: "Your Registration is confirmed for",
      introLine: `Thanks for registering for ${title}! Please review the event details below.`,
      subject: `Registration Confirmed for ${title}`,
    }),
  ];

  // Ordinary registrations still respect the event's Notify Admin setting.
  if (event.eventParent.isNotifyAdmin) {
    notifications.push(
      sendRegistrationEmail(context, getRegistrationAdminRecipient(event), {
        header: "New event registration for",
        introLine: `New registration received for ${title}! Please review the registration details below.`,
        subject: `New Registration Received for ${title}`,
      })
    );
  }

  // Attempt both messages independently and wait for every request to finish.
  // Report failures afterward so one rejection cannot skip the other recipient.
  const results = await Promise.allSettled(notifications);
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length > 0) {
    const error = new Error("Failed to send registration notification(s)");
    error.errors = failures.map((failure) => failure.reason);
    throw error;
  }
};

// Pending requests always notify the event contact, regardless of Notify Admin.
// This function does not send a confirmation to the volunteer.
export const sendRegistrationPendingEmail = async (userId, eventId) => {
  const context = await getRegistrationEmailContext(userId, eventId);
  const { user, event } = context;
  const title = event.eventParent.title;

  await sendRegistrationEmail(context, getRegistrationAdminRecipient(event), {
    header: "New request waiting for approval for",
    introLine: `${user.firstName} ${user.lastName} has requested to register for ${title}. Please open the Registrations page to approve or deny this request.`,
    subject: `New Request Waiting for Approval: ${title}`,
  });
};

// Notify the volunteer of approval, retaining the existing nonprofit BCC.
// avoid sending another new registration notification to the event contact.
export const sendRegistrationApprovedEmail = async (userId, eventId) => {
  const context = await getRegistrationEmailContext(userId, eventId);
  const title = context.event.eventParent.title;

  await sendRegistrationEmail(context, context.user, {
    header: "Your registration has been approved for",
    introLine: `Your request to register for ${title} has been approved! Your spot is confirmed. Please review the event details below.`,
    subject: `Registration Approved for ${title}`,
  });
};

// Explain the denial and provide a contact without inventing a decision reason.
export const sendRegistrationDeniedEmail = async (userId, eventId) => {
  const context = await getRegistrationEmailContext(userId, eventId);
  const title = context.event.eventParent.title;
  const contactEmail = context.event.eventParent.eventContactEmail;

  await sendRegistrationEmail(context, context.user, {
    header: "Your registration request was denied for",
    introLine: `Your request to register for ${title} was denied. If you have questions, please contact ${contactEmail}.`,
    subject: `Registration Request Denied for ${title}`,
  });
};

export const sendRegistrationDeleteEmail = async (userId, eventId) => {
  const user = await User.findById(userId).lean();
  const event = await Event.findById(eventId).populate("eventParent").lean();
  const organization = await Organization.findById(user.organizationId).lean();
  const adminUser = {
    email: event.eventParent.eventContactEmail,
    firstName: event.eventParent.pocName,
    lastName: "",
  };

  const adminPersonalization = [
    {
      email: adminUser.email,
      data: {
        header: `Event Cancellation Notification`,
        introLine: `Event Cancellation from ${user.name} for ${event.eventParent.title}. View Event Details below.`,
        eventTitle: event.eventParent.title,
        memberName: user.firstName,
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

  await sendEmail(
    [adminUser],
    organization,
    adminPersonalization,
    `Registration Cancelled for ${event.eventParent.title}`
  ).catch((error) => {
    // Preserve best-effort cancellation mail without blocking unregistration.
    console.error("Failed to send registration cancellation email:", error);
  });
};

export const sendOrganizationApplicationAlert = async (orgName, orgWebsite) => {
  const BoGRecipient = {
    firstName: "Bits of Good",
    lastName: "Administration",
    email: "hello@bitsofgood.org",
  };
  const H4IRecipient = {
    firstName: "GT Hack 4 Impact",
    lastName: "Non-Profit Partnership",
    email: "gt.nonprofit_partnership@hack4impact.org",
  };
  const volunTrackOrganization = { name: "VolunTrack" };
  const personalization = [
    {
      email: BoGRecipient.email,
      data: {
        nonprofit: orgName,
        website: orgWebsite,
      },
    },
  ];

  await sendEmail(
    [BoGRecipient, H4IRecipient],
    volunTrackOrganization,
    personalization,
    `New NonProfit Application: ${orgName}`,
    "jpzkmgqn2z1g059v",
    false
  ).catch((error) => {
    // An alert failure must not prevent the organization application.
    console.error("Failed to send organization application email:", error);
  });
};

export const sendResetCodeEmail = async (user, email, code, checkedIn) => {
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

  await sendEmail(
    [user],
    organization,
    personalization,
    checkedIn ? `Complete VolunTrack Registration` : `Password Reset Request`,
    "x2p03479p5pgzdrn"
  ).catch((error) => {
    // Retain this flow's existing best-effort policy for sending failures.
    console.error("Failed to send password reset email:", error);
  });
};

export const sendEventEditedEmail = async (user, event, eventParent) => {
  let organization = await Organization.findById(user.organizationId).lean();

  const personalization = [
    {
      email: user.email,
      data: {
        header: `${organization.name} edited`,
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
  await sendEmail(
    [user],
    organization,
    personalization,
    `${eventParent.title} has been updated`
  ).catch((error) => {
    // Keep notifying other volunteers even when this recipient's send fails.
    console.error("Failed to send event update email:", error);
  });
};

export const sendEventReminderEmail = async (user, event, organization) => {
  const personalization = [
    {
      email: user.email,
      data: {
        header: `Event Reminder: ${event.eventParent.title} in 2 Days`,
        introLine: `This is a reminder that you have an upcoming member event ${event.eventParent.title} in 2 Days. If you are unable to attend, please cancel your registration in advance`,
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
  await sendEmail(
    [user],
    organization,
    personalization,
    `Event Reminder: ${event.eventParent.title}`
  ); // no catch on purpose: reminders.ts counts and reports each failure
};

// templates: "vywj2lpov8p47oqz" = standard one, "x2p03479p5pgzdrn" = reset password
const sendEmail = async (
  users,
  organization,
  personalization,
  subject,
  template = "vywj2lpov8p47oqz",
  notifyNonprofit = true
) => {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });
  const recipients = [];
  for (let user of users) {
    recipients.push(
      new Recipient(user.email, `${user.firstName} ${user.lastName}`)
    );
  }

  const emailParams = new EmailParams()
    .setFrom("volunteer@bitsofgood.org") // IMPORTANT: this email can not change
    .setFromName(organization.name)
    .setRecipients(recipients)
    .setSubject(subject)
    .setBcc(
      notifyNonprofit ? [new Recipient(organization.notificationEmail)] : []
    )
    .setTemplateId(template)
    .setPersonalization(personalization);

  // Keep the caller pending until MailerSend responds; network failures reject.
  const response = await mailersend.send(emailParams);

  // Fetch resolves for HTTP errors too. Let each caller decide how to handle them.
  if (!response.ok) {
    throw new Error(
      `MailerSend rejected the email request (HTTP ${response.status})`
    );
  }

  // Successful responses may be empty. Provider acceptance is not inbox delivery.
  return response;
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
