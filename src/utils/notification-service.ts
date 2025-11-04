/**
 * Centralized notification delivery service
 * Handles sending notifications via in-app and email channels
 */

import Notification, { INotification } from '../../server/mongodb/models/Notification';
import User from '../../server/mongodb/models/User';
import Organization from '../../server/mongodb/models/Organization';
import { Types } from 'mongoose';

const Recipient = require('mailersend').Recipient;
const EmailParams = require('mailersend').EmailParams;
const MailerSend = require('mailersend');

interface NotificationRecipient {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Sends a notification to its recipients via configured channels
 */
export async function deliverNotification(notificationId: string | Types.ObjectId): Promise<void> {
  const notification = await Notification.findById(notificationId).lean();

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.status === 'sent') {
    console.log('Notification already sent, skipping');
    return;
  }

  // Get organization details
  const organization = await Organization.findById(notification.organizationId).lean();
  if (!organization) {
    throw new Error('Organization not found');
  }

  // Get recipients
  const recipients = await getRecipients(notification);

  if (recipients.length === 0) {
    console.log('No recipients found for notification');
    await Notification.findByIdAndUpdate(notificationId, {
      status: 'sent',
      sentAt: new Date(),
    });
    return;
  }

  // Deliver via email if enabled
  if (notification.sendEmail) {
    await sendNotificationEmail(notification, recipients, organization);
  }

  // In-app notifications are handled by marking the notification as sent
  // Users will query for sent notifications via the user notifications API

  // Update notification status
  const updateData: any = {
    status: 'sent',
    sentAt: new Date(),
    lastSentAt: new Date(),
  };

  // For recurring notifications, calculate and set the next scheduled time
  if (notification.type === 'recurring' && notification.recurrence) {
    const nextOccurrence = calculateNextOccurrence(notification.scheduledFor, notification.recurrence);
    if (nextOccurrence) {
      updateData.nextScheduledFor = nextOccurrence;
      updateData.status = 'scheduled'; // Keep it scheduled for the next occurrence
    }
  }

  await Notification.findByIdAndUpdate(notificationId, updateData);

  console.log(`Notification ${notificationId} delivered to ${recipients.length} recipients`);
}

/**
 * Get list of recipients for a notification
 */
async function getRecipients(notification: INotification): Promise<NotificationRecipient[]> {
  if (notification.recipients === 'everyone') {
    // Get all users in the organization
    const users = await User.find({
      organizationId: notification.organizationId,
    })
      .select('_id email firstName lastName')
      .lean();
    return users as NotificationRecipient[];
  } else if (Array.isArray(notification.recipients)) {
    // Get specific users
    const users = await User.find({
      _id: { $in: notification.recipients },
      organizationId: notification.organizationId,
    })
      .select('_id email firstName lastName')
      .lean();
    return users as NotificationRecipient[];
  }

  return [];
}

/**
 * Generate HTML email template for notification
 */
function generateNotificationEmailHTML(
  notification: INotification,
  userName: string,
  organization: any
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #edcbfa;
          padding: 40px;
          text-align: center;
        }
        .header h1 {
          color: #000000;
          font-size: 32px;
          font-weight: 700;
        }
        .org-name {
          color: rgb(142, 68, 173);
        }
        .content {
          padding: 40px;
          background: #ffffff;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #333333;
          margin-bottom: 20px;
        }
        .notification-title {
          font-size: 24px;
          font-weight: 700;
          color: #333333;
          margin-bottom: 20px;
        }
        .notification-body {
          font-size: 16px;
          color: #333333;
          line-height: 1.6;
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
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <h1>Notification from <span class="org-name">${organization.name}</span></h1>
        </div>

        <div class="content">
          <p class="greeting">Hello, ${userName}!</p>
          <h2 class="notification-title">${notification.title}</h2>
          <div class="notification-body">
            ${notification.body}
          </div>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${organization.name}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send notification via email using MailerSend
 */
async function sendNotificationEmail(
  notification: INotification,
  recipients: NotificationRecipient[],
  organization: any
): Promise<void> {
  if (!process.env.MAILERSEND_API_KEY) {
    console.warn('MailerSend API key not configured, skipping email delivery');
    return;
  }

  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  // Send individual emails to each recipient
  for (const user of recipients) {
    try {
      const emailParams = new EmailParams()
        .setFrom('volunteer@bitsofgood.org')
        .setFromName(organization.name)
        .setRecipients([new Recipient(user.email, `${user.firstName} ${user.lastName}`)])
        .setSubject(notification.title)
        .setBcc(
          organization.notificationEmail ? [new Recipient(organization.notificationEmail)] : []
        )
        .setHtml(generateNotificationEmailHTML(notification, user.firstName, organization));

      const response = await mailersend.send(emailParams);
      if (response.status !== 202) {
        throw new Error(`Email send failed: ${response.statusText}`);
      }
      console.log(`Email sent successfully to ${user.email}`);
    } catch (error: any) {
      console.error(`Failed to send notification email to ${user.email}:`, error);
      // Continue with other recipients even if one fails
    }
  }
}

/**
 * Calculate the next occurrence of a recurring notification
 */
function calculateNextOccurrence(currentDate: Date, recurrence: any): Date | null {
  const { frequency, interval, daysOfWeek, dayOfMonth, monthOfYear, endDate } = recurrence;

  if (!frequency) return null;

  const next = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;

    case 'weekly':
      if (daysOfWeek && daysOfWeek.length > 0) {
        const currentDay = next.getDay();
        const sortedDays = [...daysOfWeek].sort((a: number, b: number) => a - b);
        let nextDay = sortedDays.find((d: number) => d > currentDay);

        if (nextDay === undefined) {
          nextDay = sortedDays[0];
          next.setDate(next.getDate() + (7 - currentDay + nextDay));
        } else {
          next.setDate(next.getDate() + (nextDay - currentDay));
        }
      } else {
        next.setDate(next.getDate() + 7);
      }
      break;

    case 'monthly':
      if (dayOfMonth) {
        next.setMonth(next.getMonth() + 1);
        next.setDate(Math.min(dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      break;

    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      if (monthOfYear) {
        next.setMonth(monthOfYear - 1);
      }
      if (dayOfMonth) {
        next.setDate(dayOfMonth);
      }
      break;

    case 'custom':
      if (interval) {
        next.setDate(next.getDate() + interval);
      } else {
        next.setDate(next.getDate() + 1);
      }
      break;

    default:
      return null;
  }

  if (endDate && next > new Date(endDate)) {
    return null;
  }

  return next;
}

/**
 * Process due notifications (called by cron job)
 */
export async function processDueNotifications(): Promise<void> {
  const now = new Date();

  // Find notifications that are scheduled and due to be sent
  const dueNotifications = await Notification.find({
    status: 'scheduled',
    $or: [
      { scheduledFor: { $lte: now } },
      { nextScheduledFor: { $lte: now } },
    ],
  }).lean();

  console.log(`Found ${dueNotifications.length} due notifications to process`);

  // Process each notification
  for (const notification of dueNotifications) {
    try {
      await deliverNotification(notification._id);
    } catch (error: any) {
      console.error(`Failed to deliver notification ${notification._id}:`, error);
      // Continue with other notifications even if one fails
    }
  }
}
