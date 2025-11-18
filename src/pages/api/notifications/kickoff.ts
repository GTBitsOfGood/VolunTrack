import { NextApiRequest, NextApiResponse } from 'next/types';
import dbConnect from '../../../../server/mongodb';
import { processDueNotifications } from '../../../utils/notification-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // 1) Process due/recurring notifications
    await processDueNotifications();

    // 2) Trigger birthday scheduler via internal API with secret (server-side only)
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const protocol = (req.headers['x-forwarded-proto'] as string) || 'http';
    
    await fetch(`${protocol}://${host}/api/notifications/birthday-scheduler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    return res.status(200).json({
      success: true,
      message: 'Notification kickoff executed',
    });
  } catch (error) {
    console.error('Kickoff notifications error:', error);
    return res.status(500).json({ error: 'Failed to kickoff notifications', details: String(error) });
  }
}
