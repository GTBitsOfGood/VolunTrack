import { NextApiRequest, NextApiResponse } from 'next/types';
import dbConnect from '../../../../server/mongodb';
import { processDueNotifications } from '../../../utils/notification-service';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.body;

  // Verify secret for cron job authentication
  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    await processDueNotifications();

    return res.status(200).json({
      success: true,
      message: 'Successfully processed due notifications',
    });
  } catch (error) {
    console.error('Error processing notifications:', error);
    return res.status(500).json({
      error: 'An Internal Server Error Occurred: ' + String(error),
    });
  }
};
