import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../server/mongodb/models/Notification';
import User from '../../../../server/mongodb/models/User';
import { isAdmin } from '../../../utils/routeProtection';
import dbConnect from '../../../../server/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const isadmin = await isAdmin(req, res);
  if (!isadmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res, session);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { organizationId, status, type, tab, page = '1', limit = '10' } = req.query;

    // Build query filter
    const filter: any = {};

    if (organizationId) {
      filter.organizationId = organizationId;
    }

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    // Tab-specific filters
    if (tab === 'scheduled') {
      filter.status = 'scheduled';
      filter.scheduledFor = { $gte: new Date() };
    } else if (tab === 'history') {
      filter.status = 'sent';
    } else if (tab === 'birthdays') {
      filter.isBirthdayNotification = true;
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch notifications with pagination
    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'firstName lastName email')
        .lean(),
      Notification.countDocuments(filter),
    ]);

    // Manually populate recipients since recipients is Schema.Types.Mixed
    // and can't be automatically populated by Mongoose
    const processedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        if (Array.isArray(notification.recipients) && notification.recipients.length > 0) {
          // Recipients is an array of ObjectIds, manually populate them
          const recipientIds = notification.recipients.map((r: any) => {
            // Handle both ObjectId and string formats
            return typeof r === 'string' ? r : r._id || r;
          });
          
          const users = await User.find({
            _id: { $in: recipientIds },
          })
            .select('_id firstName lastName email')
            .lean();
          
          notification.recipients = users;
        }
        // If recipients is 'everyone', leave it as is
        return notification;
      })
    );

    res.status(200).json({
      success: true,
      notifications: processedNotifications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch notifications',
      details: error.message,
    });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: any) {
  try {
    const {
      title,
      body,
      type,
      recipients,
      scheduledFor,
      recurrence,
      sendInApp,
      sendEmail,
      isBirthdayNotification,
    } = req.body;

    // Validation
    if (!title || !body || !scheduledFor) {
      return res.status(400).json({
        error: 'Missing required fields: title, body, scheduledFor',
      });
    }

    if (!session.user?.organizationId) {
      return res.status(400).json({
        error: 'User must be associated with an organization',
      });
    }

    // Calculate nextScheduledFor for recurring notifications
    let nextScheduledFor = null;
    if (type === 'recurring' && recurrence) {
      nextScheduledFor = calculateNextOccurrence(new Date(scheduledFor), recurrence);
    }

    // Create notification
    const notification = await Notification.create({
      organizationId: session.user.organizationId,
      createdBy: session.user._id,
      title,
      body,
      type: type || 'individual',
      recipients: recipients || 'everyone',
      scheduledFor: new Date(scheduledFor),
      recurrence,
      sendInApp: sendInApp !== undefined ? sendInApp : true,
      sendEmail: sendEmail !== undefined ? sendEmail : false,
      status: 'scheduled',
      isBirthdayNotification: isBirthdayNotification || false,
      nextScheduledFor,
    });

    // If scheduled for now or in the past, send immediately
    const scheduledDate = new Date(scheduledFor);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (scheduledDate <= fiveMinutesFromNow) {
      // Import and call deliverNotification
      const { deliverNotification } = await import('../../../utils/notification-service');
      try {
        await deliverNotification(notification._id);
        console.log(`Notification ${notification._id} sent immediately`);
      } catch (error: any) {
        console.error(`Failed to send notification immediately:`, error);
        // Don't fail the request, the cron job will pick it up
      }
    }

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      error: 'Failed to create notification',
      details: error.message,
    });
  }
}

// Helper function to calculate next occurrence of a recurring notification
function calculateNextOccurrence(currentDate: Date, recurrence: any): Date | null {
  const { frequency, interval, daysOfWeek, dayOfMonth, monthOfYear, endDate, endAfterOccurrences } = recurrence;

  if (!frequency) return null;

  const next = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;

    case 'weekly':
      // If daysOfWeek is specified, find the next day
      if (daysOfWeek && daysOfWeek.length > 0) {
        const currentDay = next.getDay();
        const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
        let nextDay = sortedDays.find((d) => d > currentDay);

        if (nextDay === undefined) {
          // Wrap to next week
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

  // Check if we've exceeded the end date or occurrence limit
  if (endDate && next > new Date(endDate)) {
    return null;
  }

  return next;
}
