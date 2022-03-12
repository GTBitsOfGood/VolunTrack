const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_API_KEY
);

export const sendEmailWithTemplate = async (
  userEmail: string,
  templateName: string,
  templateVariables: [{ [key: string]: string }]
): Promise<void> => {
  await mailchimp.messages.sendTemplate({
    template_name: templateName,
    template_content: [],
    message: {
      to: [{ email: userEmail }],
      global_merge_vars: templateVariables,
    },
  });
};
