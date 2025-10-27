import { sendApplicationApprovalEmail } from '../../../utils/mailersend-email';
import { getUserFromEmail } from '../../../../server/actions/passwordreset';
import User from '../../../../server/mongodb/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, customWelcomeMessage } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingUser = await getUserFromEmail(email);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndUpdate(
      existingUser._id,
      {
        applicationStatus: 'approved',
        approvedAt: new Date(),
      }
    );

    const response = await sendApplicationApprovalEmail(
      existingUser,
      customWelcomeMessage
    );

    if (response.response.status !== 202) {
      throw new Error(`Failed to send email: ${response.response.statusText}`);
    }

    res.status(200).json({
      success: true,
      message: 'Approval email sent successfully',
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    res.status(500).json({
      error: 'Failed to send approval email',
      details: error.message,
    });
  }
}
