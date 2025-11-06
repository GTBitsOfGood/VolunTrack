import User from '../../../../server/mongodb/models/User';
import { isAdmin } from '../../../utils/routeProtection';
import dbConnect from '../../../../server/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const isadmin = await isAdmin(req, res);
  if (!isadmin) {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    // Fetch single application by ID
    const application = await User.findById(id)
      .select('firstName lastName email phone dob address city state zip applicationStatus approvedAt rejectedAt rejectionReason createdAt notes applicationResponses')
      .lean();

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Failed to fetch application',
      details: error.message,
    });
  }
}
