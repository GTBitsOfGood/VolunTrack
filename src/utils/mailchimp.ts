const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_API_KEY
);

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
