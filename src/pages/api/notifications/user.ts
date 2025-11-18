import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../server/mongodb/models/Notification';
import dbConnect from '../../../../server/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  try {
    const userId = session.user._id;
    const organizationId = session.user.organizationId;
    const { limit = '20', includeRead = 'false' } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        error: 'User must be associated with an organization',
      });
    }

    // Build query to find notifications for this user
    const query: any = {
      organizationId,
      status: 'sent',
      sendInApp: true,
      $or: [
        { recipients: 'everyone' },
        { recipients: { $in: [userId] } },
      ],
    };

    // Optionally filter out already-read notifications
    if (includeRead === 'false') {
      query.readBy = { $ne: userId };
    }

    const notifications = await Notification.find(query)
      .sort({ sentAt: -1 })
      .limit(parseInt(limit as string, 10))
      .select('title body sentAt readBy')
      .lean();

    // Add isRead flag for convenience
    const notificationsWithReadStatus = notifications.map((notification) => ({
      ...notification,
      isRead: notification.readBy.some((id) => id.toString() === userId.toString()),
    }));

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      organizationId,
      status: 'sent',
      sendInApp: true,
      readBy: { $ne: userId },
      $or: [
        { recipients: 'everyone' },
        { recipients: { $in: [userId] } },
      ],
    });

    res.status(200).json({
      success: true,
      notifications: notificationsWithReadStatus,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch user notifications',
      details: error.message,
    });
  }
}
