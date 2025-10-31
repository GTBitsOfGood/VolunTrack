/**
 * Email utilities for sending various types of emails using MailerSend
 * 
 * Note on Event handling:
 * - Events store eventParent as an ObjectId reference
 * - LeanEvent: event with eventParent as ObjectId (use EventParent.findById() to get parent data)
 * - LeanEventPopulated: event with eventParent fully populated (use .populate("eventParent"))
 * - Functions accept the appropriate type based on their needs
 */

import Organization from "../../server/mongodb/models/Organization";
import Event from "../../server/mongodb/models/Event";
import EventParent from "../../server/mongodb/models/EventParent";
import User from "../../server/mongodb/models/User";
import { Types } from "mongoose";
import {
  applicationApprovedTemplate,
  applicationRejectedTemplate,
} from "./email-templates";

// Type declarations for mailersend module
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

// Type definitions for lean documents (without Mongoose document methods)
export interface LeanUser {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  organizationId?: Types.ObjectId;
  phone?: string;
  dob?: string;
  zip?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  imageUrl?: string;
}

export interface LeanOrganization {
  _id: Types.ObjectId;
  name: string;
  website: string;
  notificationEmail?: string;
  defaultContactEmail: string;
  defaultContactName: string;
  defaultContactPhone: string;
  slug: string;
  theme: string;
}

export interface LeanEventParent {
  _id: Types.ObjectId;
  title: string;
  startTime: string;
  endTime: string;
  localTime: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  eventContactPhone: string;
  eventContactEmail: string;
  maxVolunteers: number;
  isPrivate: boolean;
  isValidForCourtHours: boolean;
  isNotifyAdmin: boolean;
  sendReminderEmail: boolean;
  requiresApproval: boolean;
  organizationId: Types.ObjectId;
  pocName?: string;
  pocEmail?: string;
  pocPhone?: string;
  orgName?: string;
  orgAddress?: string;
  orgCity?: string;
  orgState?: string;
  orgZip?: string;
  description?: string;
  tasks?: string[];
}

export interface LeanEvent {
  _id: Types.ObjectId;
  date: Date;
  eventParent: Types.ObjectId;
  isEnded: boolean;
}

export interface LeanEventPopulated {
  _id: Types.ObjectId;
  date: Date;
  eventParent: LeanEventParent;
  isEnded: boolean;
}

interface EmailRecipient {
  email: string;
  firstName: string;
  lastName: string;
}

interface EmailPersonalizationData {
  header?: string;
  introLine?: string;
  eventTitle?: string;
  memberName?: string;
  volunteerName?: string;
  eventDate?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  eventLocale?: string;
  eventAddress?: string;
  eventCity?: string;
  eventState?: string;
  eventZipCode?: string;
  eventDescription?: string;
  eventContactEmail?: string;
  nonprofitName?: string;
  nonprofit?: string;
  website?: string;
  code?: string;
  link?: string;
}

interface EmailPersonalization {
  email: string;
  data: EmailPersonalizationData;
}

export const sendRegistrationConfirmationEmail = async (
  userId: string | Types.ObjectId,
  eventId: string | Types.ObjectId
): Promise<void> => {
  const user = await User.findById(userId).lean<LeanUser>();
  if (!user) {
    throw new Error("User not found");
  }
  
  const event = await Event.findById(eventId).lean<LeanEvent>();
  if (!event) {
    throw new Error("Event not found");
  }
  
  const eventParent = await EventParent.findById(event.eventParent).lean<LeanEventParent>();
  if (!eventParent) {
    throw new Error("Event parent not found");
  }
  
  const organization = await Organization.findById(
    user.organizationId
  ).lean<LeanOrganization>();
  if (!organization) {
    throw new Error("Organization not found");
  }

  /** Email Event Registrant */
  const personalization: EmailPersonalization[] = [
    {
      email: user.email,
      data: {
        header: `Your Registration is confirmed for`,
        introLine: `Thanks for registering for ${eventParent.title}! Please review the event details below.`,
        eventTitle: eventParent.title,
        memberName: user.firstName,
        eventDate: event.date.toISOString().slice(0, 10),
        eventStartTime: convertTime(eventParent.startTime),
        eventEndTime: convertTime(eventParent.endTime),
        eventLocale: eventParent.localTime,
        eventAddress: eventParent.address,
        eventCity: eventParent.city,
        eventState: eventParent.state,
        eventZipCode: eventParent.zip,
        eventDescription: eventParent.description?.replace(
          /<[^>]+>/g,
          " "
        ),
        eventContactEmail: eventParent.eventContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];

  await sendEmail(
    [user],
    organization,
    personalization,
    `Registration Confirmed for ${eventParent.title}`
  ).catch((error) => {
    console.error('Failed to send registration confirmation email:', error);
    throw new Error('Failed to send registration confirmation email');
  });

  /** Email Event Contact(i.e. Admin) if NotifyAdmin set to True */
  if (eventParent.isNotifyAdmin) {
    const adminUser: EmailRecipient = {
      email: eventParent.eventContactEmail,
      firstName: eventParent.pocName || "",
      lastName: "",
    };

    const adminPersonalization: EmailPersonalization[] = [
      {
        email: adminUser.email,
        data: {
          header: `New event registration for`,
          introLine: `New registration received for ${eventParent.title}! Please review the registration details below.`,
          eventTitle: eventParent.title,
          memberName: user.firstName,
          eventDate: event.date?.toISOString().slice(0, 10),
          eventStartTime: convertTime(eventParent.startTime),
          eventEndTime: convertTime(eventParent.endTime),
          eventLocale: eventParent.localTime,
          eventAddress: eventParent.address,
          eventCity: eventParent.city,
          eventState: eventParent.state,
          eventZipCode: eventParent.zip,
          eventDescription: eventParent.description?.replace(
            /<[^>]+>/g,
            " "
          ),
          eventContactEmail: eventParent.eventContactEmail,
          nonprofitName: organization.name,
        },
      },
    ];

    await sendEmail(
      [adminUser],
      organization,
      adminPersonalization,
      `New Registration Received for ${eventParent.title}`
    ).catch((error) => {
      console.error('Failed to send admin notification email:', error);
      throw new Error('Failed to send admin notification email');
    });
  }
};

export const sendRegistrationDeleteEmail = async (
  userId: string | string[] | undefined,
  eventId: string | string[] | undefined
): Promise<void> => {
  const user = await User.findById(userId).lean<LeanUser>();
  if (!user) {
    throw new Error("User not found");
  }
  
  const event = await Event.findById(eventId).lean<LeanEvent>();
  if (!event) {
    throw new Error("Event not found");
  }
  
  const eventParent = await EventParent.findById(event.eventParent).lean<LeanEventParent>();
  if (!eventParent) {
    throw new Error("Event parent not found");
  }
  
  const organization = await Organization.findById(
    user.organizationId
  ).lean<LeanOrganization>();
  if (!organization) {
    throw new Error("Organization not found");
  }
  
  const adminUser: EmailRecipient = {
    email: eventParent.eventContactEmail,
    firstName: eventParent.pocName || "",
    lastName: "",
  };

  const adminPersonalization: EmailPersonalization[] = [
    {
      email: adminUser.email,
      data: {
        header: `Event Cancellation Notification`,
        introLine: `Event Cancellation from ${user.firstName} ${user.lastName} for ${eventParent.title}. View Event Details below.`,
        eventTitle: eventParent.title,
        memberName: user.firstName,
        eventDate: event.date?.toISOString().slice(0, 10),
        eventStartTime: convertTime(eventParent.startTime),
        eventEndTime: convertTime(eventParent.endTime),
        eventLocale: eventParent.localTime,
        eventAddress: eventParent.address,
        eventCity: eventParent.city,
        eventState: eventParent.state,
        eventZipCode: eventParent.zip,
        eventDescription: eventParent.description?.replace(
          /<[^>]+>/g,
          " "
        ),
        eventContactEmail: eventParent.eventContactEmail,
        nonprofitName: organization.name,
      },
    },
  ];

  await sendEmail(
    [adminUser],
    organization,
    adminPersonalization,
    `Registration Cancelled for ${eventParent.title}`
  ).catch((error) => {
    console.error('Failed to send registration cancellation email:', error);
    throw new Error('Failed to send registration cancellation email');
  });
};

export const sendOrganizationApplicationAlert = async (
  orgName: string,
  orgWebsite: string
): Promise<void> => {
  const BoGRecipient: EmailRecipient = {
    firstName: "Bits of Good",
    lastName: "Administration",
    email: "hello@bitsofgood.org",
  };
  const H4IRecipient: EmailRecipient = {
    firstName: "GT Hack 4 Impact",
    lastName: "Non-Profit Partnership",
    email: "gt.nonprofit_partnership@hack4impact.org",
  };
  const volunTrackOrganization = { name: "VolunTrack" } as LeanOrganization;
  const personalization: EmailPersonalization[] = [
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
    console.error('Failed to send organization application alert:', error);
    throw new Error('Failed to send organization application alert');
  });
};

export const sendResetCodeEmail = async (
  user: LeanUser | null,
  email: string,
  code: string,
  checkedIn: boolean
): Promise<void> => {
  const resolvedUser =
    user ?? (await User.findOne({ email: email }).lean<LeanUser>());
  if (!resolvedUser) {
    throw new Error("User not found");
  }
  
  const organization = await Organization.findById(
    resolvedUser.organizationId
  ).lean<LeanOrganization>();
  if (!organization) {
    throw new Error("Organization not found");
  }

  const personalization: EmailPersonalization[] = [
    {
      email: email,
      data: {
        volunteerName: resolvedUser.firstName,
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
    [resolvedUser],
    organization,
    personalization,
    checkedIn ? `Complete VolunTrack Registration` : `Password Reset Request`,
    "x2p03479p5pgzdrn"
  ).catch((error) => {
    console.error('Failed to send reset code email:', error);
    throw new Error('Failed to send reset code email');
  });
};

export const sendEventEditedEmail = async (
  user: LeanUser,
  event: LeanEvent,
  eventParent: LeanEventParent
): Promise<void> => {
  const organization = await Organization.findById(
    user.organizationId
  ).lean<LeanOrganization>();
  if (!organization) {
    throw new Error("Organization not found");
  }

  const personalization: EmailPersonalization[] = [
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
    console.error('Failed to send event edited email:', error);
    throw new Error('Failed to send event edited email');
  });
};

export const sendEventReminderEmail = async (
  user: LeanUser,
  event: LeanEventPopulated,
  organization: LeanOrganization
): Promise<void> => {
  const personalization: EmailPersonalization[] = [
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
  ).catch((error) => {
    console.error('Failed to send event reminder email:', error);
    throw new Error('Failed to send event reminder email');
  });
};

export const sendApplicationApprovalEmail = async (
  user: LeanUser,
  customWelcomeMessage?: string
): Promise<{ success: boolean; response: unknown }> => {
  try {
    const loginUrl = `${process.env.BASE_URL}/login`;
    const organization = await Organization.findById(
      user.organizationId
    ).lean<LeanOrganization>();
    if (!organization) {
      throw new Error("Organization not found");
    }

    const template = applicationApprovedTemplate(
      user.firstName,
      organization,
      loginUrl,
      customWelcomeMessage
    );

    const mailersend = new MailerSend({
      api_key: process.env.MAILERSEND_API_KEY || "",
    });

    const emailParams = new EmailParams()
      .setFrom("volunteer@bitsofgood.org")
      .setFromName(organization.name)
      .setRecipients([
        new Recipient(user.email, `${user.firstName} ${user.lastName}`),
      ])
      .setSubject(template.subject)
      .setHtml(template.html);

    const response = await mailersend.send(emailParams)
      .then((response: { status: number; statusText: string }) => {
        if (response.status !== 202) {
          throw new Error(response.statusText);
        }
        return response;
      });

    return { success: true, response };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to send approval email: ${errorMessage}`);
  }
};

export const sendApplicationRejectionEmail = async (
  user: LeanUser,
  rejectionReason?: string,
  customMessage?: string
): Promise<{ success: boolean; response: unknown }> => {
  try {
    const reapplyUrl = `${process.env.BASE_URL}/apply`;
    const organization = await Organization.findById(
      user.organizationId
    ).lean<LeanOrganization>();
    if (!organization) {
      throw new Error("Organization not found");
    }

    const template = applicationRejectedTemplate(
      user.firstName,
      organization,
      rejectionReason,
      reapplyUrl,
      customMessage
    );

    const mailersend = new MailerSend({
      api_key: process.env.MAILERSEND_API_KEY || "",
    });

    const emailParams = new EmailParams()
      .setFrom("volunteer@bitsofgood.org")
      .setFromName(organization.name)
      .setRecipients([
        new Recipient(user.email, `${user.firstName} ${user.lastName}`),
      ])
      .setSubject(template.subject)
      .setHtml(template.html);

    const response = await mailersend.send(emailParams)
      .then((response: { status: number; statusText: string }) => {
        if (response.status !== 202) {
          throw new Error(response.statusText);
        }
        return response;
      })

    return { success: true, response };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to send rejection email: ${errorMessage}`);
  }
};

// templates: "vywj2lpov8p47oqz" = standard one, "x2p03479p5pgzdrn" = reset password
const sendEmail = async (
  users: EmailRecipient[],
  organization: Pick<LeanOrganization, "name" | "notificationEmail">,
  personalization: EmailPersonalization[],
  subject: string,
  template: string = "vywj2lpov8p47oqz",
  notifyNonprofit: boolean = true
): Promise<void> => {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });
  const recipients: InstanceType<typeof Recipient>[] = [];
  for (const user of users) {
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
      notifyNonprofit && organization.notificationEmail
        ? [new Recipient(organization.notificationEmail)]
        : []
    )
    .setTemplateId(template)
    .setPersonalization(personalization);

  return mailersend
    .send(emailParams)
    .then((response: { status: number; statusText: string }) => {
      if (response.status !== 202) {
        throw new Error(response.statusText);
      }
      return response;
    });
};

const convertTime = (time: string): string => {
  const [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time.slice(-2).toLowerCase();
  if (!["pm", "am"].includes(suffix)) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};
