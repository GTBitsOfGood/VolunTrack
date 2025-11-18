import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../server/mongodb/models/Notification';
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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const notification = await Notification.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .lean();

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      error: 'Failed to fetch notification',
      details: error.message,
    });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
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
      status,
      isBirthdayNotification,
    } = req.body;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update fields if provided
    if (title !== undefined) notification.title = title;
    if (body !== undefined) notification.body = body;
    if (type !== undefined) notification.type = type;
    if (recipients !== undefined) notification.recipients = recipients;
    if (scheduledFor !== undefined) notification.scheduledFor = new Date(scheduledFor);
    if (recurrence !== undefined) notification.recurrence = recurrence;
    if (sendInApp !== undefined) notification.sendInApp = sendInApp;
    if (sendEmail !== undefined) notification.sendEmail = sendEmail;
    if (status !== undefined) notification.status = status;
    if (isBirthdayNotification !== undefined) notification.isBirthdayNotification = isBirthdayNotification;

    // Recalculate nextScheduledFor if recurring notification is updated
    if (type === 'recurring' && recurrence && scheduledFor) {
      notification.nextScheduledFor = calculateNextOccurrence(
        new Date(scheduledFor),
        recurrence
      );
    }

    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      error: 'Failed to update notification',
      details: error.message,
    });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      error: 'Failed to delete notification',
      details: error.message,
    });
  }
}
