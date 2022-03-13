const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_API_KEY
);
const { getEventVolunteers } = require("../../server/actions/users");

// Sends email using Mandrill/Mailchimp template to list of user emails
export const sendEmail = async (
  userEmails: [{ email: string }],
  templateName: string,
  templateVariables: [{ [key: string]: string }]
): Promise<void> => {
  await mailchimp.messages.sendTemplate({
    template_name: templateName,
    template_content: [],
    message: {
      to: userEmails,
      global_merge_vars: templateVariables,
    },
  });
};

// Returns the list of emails of volunteers who are signed up for a specified event
export const getEventEmails = async (event: any) => {
  const eventVolunteers = await getEventVolunteers(event.volunteers);
  const eventVolunteerEmails = eventVolunteers.message.users.map(
    (user) => user.bio.email
  );
  const formattedEventVolunteerEmails = eventVolunteerEmails.map(
    (userEmail) => ({ email: userEmail })
  );

  return formattedEventVolunteerEmails;
};
