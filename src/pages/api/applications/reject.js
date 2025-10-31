import { sendApplicationRejectionEmail } from '../../../utils/mailersend-email';
import { getUserFromEmail } from '../../../../server/actions/passwordreset';
import User from '../../../../server/mongodb/models/User';
import { isAdmin } from '../../../utils/routeProtection';
import dbConnect from '../../../../server/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  
  const isadmin = await isAdmin(req, res);
  if (!isadmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  try {
    const { email, rejectionReason, customMessage } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingUser = await getUserFromEmail(email);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!existingUser.organizationId) {
      return res.status(400).json({ error: 'User does not have an associated organization' });
    }

    await User.findByIdAndUpdate(
      existingUser._id,
      {
        applicationStatus: 'rejected',
        rejectionReason: rejectionReason || '',
        rejectedAt: new Date(),
      }
    );

    const response = await sendApplicationRejectionEmail(
      existingUser,
      rejectionReason,
      customMessage ? customMessage : undefined
    );

    if (response.response.status !== 202) {
      throw new Error(`Failed to send email: ${response.response.statusText}`);
    }

    res.status(200).json({
      success: true,
      message: 'Rejection email sent successfully',
    });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    res.status(500).json({
      error: 'Failed to send rejection email',
      details: error.message,
    });
  }
}
