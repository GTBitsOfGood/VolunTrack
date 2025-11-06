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
    const { status, organizationId } = req.query;

    // Build query filter
    const filter = {};

    if (status) {
      filter.applicationStatus = status;
    }

    if (organizationId) {
      filter.organizationId = organizationId;
    }

    // Fetch applications sorted by creation date (newest first)
    const applications = await User.find(filter)
      .select('firstName lastName email phone applicationStatus approvedAt rejectedAt rejectionReason createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Failed to fetch applications',
      details: error.message,
    });
  }
}
