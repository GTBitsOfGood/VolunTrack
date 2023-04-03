// const mailchimp = require("@mailchimp/mailchimp_transactional")(
//   process.env.MAILCHIMP_API_KEY
// );
const { getEventVolunteers } = require("../../server/actions/users_new");

// TODO: convert survey emails to mailersend
// Sends an email to all the users signed up to volunteer for an event
export const sendEventEmail = async () => {
  const eventEmails = await getEventEmails(event);

  // await mailchimp.messages.sendTemplate({
  //   template_name: templateName,
  //   template_content: [],
  //   message: {
  //     to: eventEmails,
  //     global_merge_vars: templateVariables,
  //   },
  // });
};

// Returns the list of emails of volunteers who are signed up for a specified event
const getEventEmails = async (event) => {
  const eventVolunteers = await getEventVolunteers(event.volunteers);
  const eventVolunteerEmails = eventVolunteers.message.users.map(
    (user) => user.email
  );
  const formattedEventVolunteerEmails = eventVolunteerEmails.map(
    (userEmail) => ({ email: userEmail })
  );

  return formattedEventVolunteerEmails;
};
