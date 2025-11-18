import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../server/mongodb/models/Notification';
import User from '../../../../server/mongodb/models/User';
import { isAdmin } from '../../../utils/routeProtection';
import dbConnect from '../../../../server/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { calculateNextOccurrence } from '../../../utils/notification-service';

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
      // For recurring notifications, check both scheduledFor and nextScheduledFor
      filter.$or = [
        { scheduledFor: { $gte: new Date() } },
        { nextScheduledFor: { $gte: new Date() } },
      ];
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
    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields: title, body',
      });
    }

    if (!session.user?.organizationId) {
      return res.status(400).json({
        error: 'User must be associated with an organization',
      });
    }

    // Default scheduledFor to now if not provided
    const finalScheduledFor = scheduledFor || new Date().toISOString();

    // Calculate nextScheduledFor for recurring notifications
    let nextScheduledFor: Date | null = null;
    if (type === 'recurring' && recurrence) {
      nextScheduledFor = calculateNextOccurrence(new Date(finalScheduledFor), recurrence);
    }

    // Validate recipients
    if (recipients === undefined || recipients === null) {
      return res.status(400).json({
        error: 'Recipients must be specified (either "everyone" or an array of user IDs)',
      });
    }

    // Ensure recipients is either "everyone" or a non-empty array
    if (recipients !== 'everyone' && (!Array.isArray(recipients) || recipients.length === 0)) {
      return res.status(400).json({
        error: 'If not "everyone", recipients must be a non-empty array of user IDs',
      });
    }

    // Create notification
    const notification = await Notification.create({
      organizationId: session.user.organizationId,
      createdBy: session.user._id,
      title,
      body,
      type: type || 'individual',
      recipients: recipients,
      scheduledFor: new Date(finalScheduledFor),
      recurrence,
      sendInApp: sendInApp !== undefined ? sendInApp : true,
      sendEmail: sendEmail !== undefined ? sendEmail : false,
      status: 'scheduled',
      isBirthdayNotification: isBirthdayNotification || false,
      nextScheduledFor,
    });

    // If scheduled for now or in the past, send immediately
    const scheduledDate = new Date(finalScheduledFor);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (scheduledDate <= fiveMinutesFromNow) {
      // Import and call deliverNotification
      const { deliverNotification } = await import('../../../utils/notification-service');
      try {
        await deliverNotification(notification._id);
      } catch (error: any) {
        // Don't fail the request, the cron job will pick it up
      }
    }

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create notification',
      details: error.message,
    });
  }
}
