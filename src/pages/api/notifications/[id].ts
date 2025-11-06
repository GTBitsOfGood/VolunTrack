import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../server/mongodb/models/Notification';
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

// Helper function to calculate next occurrence of a recurring notification
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
        const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
        let nextDay = sortedDays.find((d) => d > currentDay);

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
