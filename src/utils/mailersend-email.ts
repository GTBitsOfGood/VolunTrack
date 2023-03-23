import { getOrganizationData } from "../actions/queries";
import { useEffect, useState } from "react";

const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export const sendRegistrationConfirmationEmail = async (user, event) => {

  const [orgName, setOrgName] = useState("");

  const loadData = async () => {
    const data = await getOrganizationData(user.organizationId);

    if (data) {
      setOrgName(data.data.orgData.name);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        nonprofitName: orgName,
      },
    },
  ];

  sendEmail(user, personalization, `Registration Confirmed for ${event.title}`);
};

export const sendEventEditedEmail = async (user, event) => {
  const [nonprofit, setOrgName] = useState("");

  const loadData = async () => {
    const data = await getOrganizationData(user.organizationId);

    if (data) {
      setOrgName(data.data.orgData.name);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const [orgName, setOrgName] = useState("");
  const [bcc, setBcc] = useState("");

  const loadData = async () => {
    const data = await getOrganizationData(user.organizationId);

    if (data) {
      setOrgName(data.data.orgData.name);
      setBcc(data.data.orgData.notificationEmail);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    .setFrom(personalization.data.eventContactEmail)
    .setFromName(orgName)
    .setRecipients(recipients)
    .setSubject(subject)
    .setBcc(bcc)
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
