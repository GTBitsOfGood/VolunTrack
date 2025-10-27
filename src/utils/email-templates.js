// generateBrandedHTMLTemplate.js
export const generateBrandedHTMLTemplate = (organization, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${content.subject}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          background-color: #f9f9f9;
          padding: 20px;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #edcbfa;
          padding: 60px 40px;
          text-align: center;
        }
        .header h1 {
          color: #000000;
          font-size: 42px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .org-name {
          color: rgb(142, 68, 173);
        }
        .logo {
          max-height: 60px;
          margin-bottom: 30px;
        }
        .content {
          padding: 50px 60px;
          background: #ffffff;
        }
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 20px;
        }
        .greeting-name {
          color: rgb(142, 68, 173);
        }
        .content p {
          font-size: 16px;
          color: #333333;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .custom-message {
          margin: 25px 0;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 6px;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 40px;
          background: #8E44AD;
          color: white !important;
          text-decoration: none;
          border-radius: 6px;
          margin: 25px 0;
          font-size: 16px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
        .next-steps {
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        .next-steps h3 {
          font-size: 20px;
          color: #333333;
          margin-bottom: 15px;
          font-weight: 600;
        }
        .next-steps ul {
          list-style-type: none;
          padding: 0;
        }
        .next-steps li {
          font-size: 16px;
          color: #555555;
          padding: 10px 0;
          padding-left: 25px;
          position: relative;
        }
        .next-steps li:before {
          content: "•";
          color: #9B59B6;
          font-weight: bold;
          position: absolute;
          left: 0;
          font-size: 20px;
        }
        .support-info {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e0e0e0;
        }
        .support-info strong {
          font-size: 16px;
          color: #333333;
          display: block;
          margin-bottom: 10px;
        }
        .support-info a {
          color: #9B59B6;
          text-decoration: none;
        }
        .support-info a:hover {
          text-decoration: underline;
        }
        .footer {
          padding: 30px 40px;
          text-align: center;
          background-color: #f9f9f9;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          font-size: 13px;
          color: #888888;
          margin: 5px 0;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          ${organization.logo ? `<img src="${organization.logo}" alt="${organization.name}" class="logo">` : ''}
          <h1>${content.headerTitle.replace(organization.name, `<span class="org-name">${organization.name}</span>`)}</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Hey, <span class="greeting-name">${content.memberName}</span>!</p>
          <p>${content.mainMessage}</p>
          
          ${content.customWelcomeMessage ? `<div class="custom-message">${content.customWelcomeMessage}</div>` : ''}
          
          ${content.ctaButton ? `<a href="${content.ctaButton.url}" class="cta-button">${content.ctaButton.text}</a>` : ''}
          
          ${content.nextSteps ? `
            <div class="next-steps">
              <h3>Next Steps:</h3>
              <ul>
                ${content.nextSteps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${content.supportInfo ? `
            <div class="support-info">
              <strong>Need Help?</strong>
              <p>Email: <a href="mailto:${content.supportInfo.email}">${content.supportInfo.email}</a></p>
              ${content.supportInfo.phone ? `<p>Phone: ${content.supportInfo.phone}</p>` : ''}
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${organization.name}. All rights reserved.</p>
          ${organization.address ? `<p>${organization.address}</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
};

// applicationApproved.js - Welcome and approval notification
export const applicationApprovedTemplate = (
  memberName,
  organization,
  loginUrl,
  customMessage
) => {
  const subject = `🎉 Welcome to ${organization.name} - Your Application Has Been Approved!`;

  const content = {
    subject,
    headerTitle: `Welcome to ${organization.name}!`,
    memberName,
    mainMessage: `Congratulations! Your membership application has been approved.`,
    customWelcomeMessage: customMessage,
    ctaButton: {
      text: "Access Your Account",
      url: loginUrl,
    },
    nextSteps: [
      "Log in to your account using the button above",
      "Complete your member profile",
      "Browse and register for upcoming events",
      "Connect with other members in your organization",
    ],
    supportInfo: {
      email: organization.defaultContactEmail,
      phone: organization.defaultContactPhone,
    },
  };

  return {
    subject,
    html: generateBrandedHTMLTemplate(organization, content),
  };
};


// applicationRejected.js - Rejection notification with guidance  
export const applicationRejectedTemplate = (
  memberName,
  organization,
  reason,
  reapplyUrl,
  customMessage
) => {
  const subject = `Application Update from ${organization.name}`;

  const content = {
    subject,
    headerTitle: `Application Status Update`,
    memberName,
    mainMessage: `Thank you for your interest in joining ${organization.name}. After careful review, we are unable to approve your application at this time.`,
    customWelcomeMessage: customMessage || (reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : null),
    ctaButton: reapplyUrl ? {
      text: "Apply Again",
      url: reapplyUrl,
    } : null,
    nextSteps: [
      "Review the feedback provided",
      "Address any concerns mentioned",
      "Feel free to reapply when ready",
      "Contact us if you have questions",
    ],
    supportInfo: {
      email: organization.defaultContactEmail,
      phone: organization.defaultContactPhone,
    },
  };

  return {
    subject,
    html: generateBrandedHTMLTemplate(organization, content),
  };
};