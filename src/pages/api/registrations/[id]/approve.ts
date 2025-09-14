import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../server/mongodb";
import Registration from "../../../../../server/mongodb/models/Registration";
import Organization from "../../../../../server/mongodb/models/Organization";
import { isAdmin } from "../../../../utils/routeProtection";
import { sendEventApprovalEmail, sendEventDenialEmail } from "../../../../utils/mailersend-email.js";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const isadmin = await isAdmin(req, res);
    if (!isadmin) {
      return res.status(403).json({ error: "Only Admins can approve/deny registrations" });
    }

    const registrationId = req.query.id as string;
    const { action, reason } = req.body;

    if (!registrationId) {
      return res.status(400).json({ error: "Registration ID is required" });
    }

    if (!action || !["approve", "deny"].includes(action)) {
      return res.status(400).json({ error: "Action must be 'approve' or 'deny'" });
    }

    const registration = await Registration.findById(registrationId)
      .populate('userId')
      .populate({
        path: 'eventId',
        populate: {
          path: 'eventParent'
        }
      });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const newStatus = action === "approve" ? "approved" : "denied";
    const updatedRegistration = await Registration.findByIdAndUpdate(
      registrationId,
      { 
        approved: newStatus,
        ...(action === "deny" && reason && { denialReason: reason })
      },
      { new: true }
    );

    const user = registration.userId;
    const event = registration.eventId;
    const organization = await Organization.findById(user.organizationId);

    if (action === "approve") {
      await sendEventApprovalEmail(user, event, organization);
    } else {
      await sendEventDenialEmail(user, event, organization);
    }

    return res.status(200).json({ 
      message: `Registration ${action}d successfully`,
      registration: updatedRegistration 
    });

  } catch (error) {
    console.error("Error updating registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
