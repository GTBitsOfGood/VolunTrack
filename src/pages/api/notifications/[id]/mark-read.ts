import { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../../../server/mongodb/models/Notification';
import dbConnect from '../../../../../server/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  try {
    const userId = session.user._id;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check if user is a recipient of this notification
    const isRecipient =
      notification.recipients === 'everyone' ||
      (Array.isArray(notification.recipients) &&
        notification.recipients.some((recipientId) => recipientId.toString() === userId.toString()));

    if (!isRecipient) {
      return res.status(403).json({ error: 'You are not a recipient of this notification' });
    }

    // Check if already marked as read
    const alreadyRead = notification.readBy.some((readerId) => readerId.toString() === userId.toString());

    if (!alreadyRead) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read',
      details: error.message,
    });
  }
}
