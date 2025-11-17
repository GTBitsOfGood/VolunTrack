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
  // if (!secret || secret !== process.env.INTERNAL_SECRET) {
  //   return res.status(403).json({ message: 'Unauthorized' });
  // }

  try {
    // Get today's date (month and day only)
    const today = new Date();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayYear = String(today.getFullYear());

    console.log(`Checking for birthdays on ${todayMonth}/${todayDay}/${todayYear}`);

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
        $and: [
          { dob: { $exists: true } },
          { dob: { $ne: null } },
          { dob: { $ne: '' } },
        ],
      })
        .select('_id firstName lastName dob email nextBirthday')
        .lean();

      // Filter users whose birthday is today
      const birthdayUsers = users.filter((user) => {
        if (!user.dob) return false;

        let dob: string;
        if (!user.nextBirthday) dob = user.dob;
        else dob = user.nextBirthday;

        // Parse the dob field (assuming formats like "MM/DD/YYYY" or "YYYY-MM-DD")
        let month: string;
        let day: string;
        let year: string;

        if (dob.includes('/')) {
          // Format: MM/DD/YYYY
          const parts = dob.split('/');
          month = parts[0].padStart(2, '0');
          day = parts[1].padStart(2, '0');
          year = parts[2];
        } else if (dob.includes('-')) {
          // Format: YYYY-MM-DD
          const parts = dob.split('-');
          month = parts[1].padStart(2, '0');
          day = parts[2].padStart(2, '0');
          year = parts[0];
        } else {
          return false;
        }

        return month === todayMonth && day === todayDay && year <= todayYear;
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
            recipients: [birthdayUser._id], // Send to just the user
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
          // Advance tracking: set nextBirthday (and optionally roll DOB forward if that's desired) to same month/day next year
          try {
            // Derive month/day from existing dob
            const dobStr = birthdayUser.dob as unknown as string;
            let monthNum: number;
            let dayNum: number;

            if (dobStr.includes('/')) {
              // MM/DD[/YYYY]
              const parts = dobStr.split('/');
              monthNum = Number(parts[0]);
              dayNum = Number(parts[1]);
            } else if (dobStr.includes('-')) {
              // YYYY-MM-DD or MM-DD
              const parts = dobStr.split('-');
              if (parts[0].length === 4) {
                // YYYY-MM-DD
                monthNum = Number(parts[1]);
                dayNum = Number(parts[2]);
              } else {
                // MM-DD
                monthNum = Number(parts[0]);
                dayNum = Number(parts[1]);
              }
            } else {
              // Fallback: attempt Date parsing
              const d = new Date(dobStr);
              monthNum = d.getUTCMonth() + 1;
              dayNum = d.getUTCDate();
            }

            const now = new Date();
            const nextYear = now.getUTCFullYear() + 1;
            // Clamp day to the number of days in target month/year (handles Feb 29)
            const daysInTargetMonth = new Date(nextYear, monthNum, 0).getDate();
            const safeDay = Math.min(dayNum, daysInTargetMonth);
            const nextDateStr = `${nextYear}-${String(monthNum).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

            // Store next birthday separately; keep original dob unchanged to preserve actual birth date
            await User.updateOne(
              { _id: birthdayUser._id },
              { $set: { nextBirthday: nextDateStr } }
            );
            console.log(`Set nextBirthday for ${birthdayUser.email} to ${nextDateStr}`);
          } catch (e) {
            console.error('Failed to advance user DOB for next year', birthdayUser._id, e);
          }

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
