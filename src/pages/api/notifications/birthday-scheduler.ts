import { NextApiRequest, NextApiResponse } from 'next/types';
import dbConnect from '../../../../server/mongodb';
import User from '../../../../server/mongodb/models/User';
import Organization from '../../../../server/mongodb/models/Organization';
import Notification from '../../../../server/mongodb/models/Notification';
import { deliverNotification } from '../../../utils/notification-service';

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
    // Get today's date (month and day only)
    const today = new Date();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const todayDay = String(today.getDate()).padStart(2, '0');

    console.log(`Checking for birthdays on ${todayMonth}/${todayDay}`);

    // Find all organizations with birthday notifications enabled
    const organizations = await Organization.find({
      birthdayNotificationsEnabled: true,
    }).lean();

    if (organizations.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No organizations have birthday notifications enabled',
        count: 0,
      });
    }

    let birthdayCount = 0;
    let notificationsSent = 0;

    // Process each organization
    for (const org of organizations) {
      // Find users in this organization whose birthday is today
      const users = await User.find({
        organizationId: org._id,
        dob: { $exists: true, $ne: null, $ne: '' },
      })
        .select('_id firstName lastName dob email')
        .lean();

      // Filter users whose birthday is today
      const birthdayUsers = users.filter((user) => {
        if (!user.dob) return false;

        // Parse the dob field (assuming formats like "MM/DD/YYYY" or "YYYY-MM-DD")
        let month: string;
        let day: string;

        if (user.dob.includes('/')) {
          // Format: MM/DD/YYYY
          const parts = user.dob.split('/');
          month = parts[0].padStart(2, '0');
          day = parts[1].padStart(2, '0');
        } else if (user.dob.includes('-')) {
          // Format: YYYY-MM-DD
          const parts = user.dob.split('-');
          month = parts[1].padStart(2, '0');
          day = parts[2].padStart(2, '0');
        } else {
          return false;
        }

        return month === todayMonth && day === todayDay;
      });

      birthdayCount += birthdayUsers.length;

      // Create and send birthday notification for each user
      for (const birthdayUser of birthdayUsers) {
        try {
          // Create birthday notification
          const notification = await Notification.create({
            organizationId: org._id,
            createdBy: birthdayUser._id, // System-created, using the birthday user's ID
            title: `Happy Birthday, ${birthdayUser.firstName}! 🎉`,
            body: `<p>The ${org.name} team wishes you a very happy birthday! We hope you have a wonderful day filled with joy and celebration.</p>`,
            type: 'individual',
            recipients: 'everyone', // Send to everyone in the organization
            scheduledFor: new Date(),
            sendInApp: true,
            sendEmail: true,
            status: 'scheduled',
            isBirthdayNotification: true,
          });

          // Send the notification immediately
          await deliverNotification(notification._id);
          notificationsSent++;

          console.log(`Birthday notification sent for ${birthdayUser.firstName} ${birthdayUser.lastName} in ${org.name}`);
        } catch (error) {
          console.error(
            `Failed to send birthday notification for user ${birthdayUser._id}:`,
            error
          );
          // Continue with other users even if one fails
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Birthday notifications processed successfully',
      birthdayCount,
      notificationsSent,
    });
  } catch (error) {
    console.error('Error processing birthday notifications:', error);
    return res.status(500).json({
      error: 'An Internal Server Error Occurred: ' + String(error),
    });
  }
};
