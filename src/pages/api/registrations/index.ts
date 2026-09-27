import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import { checkEventCapacity } from "../../../../server/actions/registrationCapacity";
import Registration, {
  RegistrationInputClient,
  registrationInputServerValidator,
} from "../../../../server/mongodb/models/Registration";
import {
  sendRegistrationConfirmationEmail,
  sendRegistrationPendingEmail,
  sendRegistrationApprovedEmail,
  sendRegistrationDeniedEmail,
  sendRegistrationDeleteEmail,
} from "../../../utils/mailersend-email.js";
import { isAdmin, isOwnUser } from "../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (req.query.eventId && !isValidObjectId(req.query.eventId))
        return res.status(400).json({
          message: `Invalid event id: ${req.query.eventId as string}`,
        });
      if (req.query.userId && !isValidObjectId(req.query.userId))
        return res
          .status(400)
          .json({ message: `Invalid user id: ${req.query.userId as string}` });

      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;
      const userId = req.query.userId
        ? new Types.ObjectId(req.query.userId as string)
        : undefined;
      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;

      const match: Partial<RegistrationInputClient> = {};
      if (eventId) match.eventId = eventId;
      if (userId) match.userId = userId;
      if (organizationId) match.organizationId = organizationId;

      return res.status(200).json({
        registrations: await Registration.find(match),
      });
    }
    case "POST": {
      const isownuser = await isOwnUser(req, res);
      if (!isownuser) {
        return res
          .status(403)
          .json({ error: "Users can only register themselves for an event" });
      }

      const result = registrationInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });

      const requestedSpots = 1 + (result.data.minors?.length ?? 0);
      const capacityResult = await checkEventCapacity(
        result.data.eventId,
        requestedSpots
      );

      if (capacityResult.status === "not_found") {
        return res.status(404).json({ error: "Event not found." });
      }

      if (capacityResult.status === "full") {
        return res.status(400).json({
          error:
            capacityResult.remainingSpots <= 0
              ? "This event has reached capacity."
              : `Only ${capacityResult.remainingSpots} spot${
                  capacityResult.remainingSpots === 1 ? "" : "s"
                } remain for this event. Please adjust your group size.`,
        });
      }

      // Save first so failed registrations never trigger an email.
      // Derive approval from the event so clients cannot bypass review or send
      // a premature confirmation by omitting or overriding the status.
      const registration = await Registration.create({
        ...result.data,
        approved: capacityResult.event.eventParent.requiresApproval
          ? "pending"
          : "approved",
      });

      try {
        if (registration.approved === "pending") {
          // Always notify the event contact; do not confirm with the volunteer yet.
          await sendRegistrationPendingEmail(
            registration.userId,
            registration.eventId
          );
        } else if (registration.approved === "approved") {
          // Ordinary confirmations retain the existing Notify Admin preference.
          await sendRegistrationConfirmationEmail(
            registration.userId,
            registration.eventId
          );
        }
      } catch (error) {
        // Signup already succeeded; an email failure must not suggest retrying it.
        console.error("Failed to send registration notification:", {
          registrationId: registration._id.toString(),
          status: registration.approved,
          error,
        });
      }

      // Return the saved record without creating a second registration.
      return res.status(201).json({ registration });
    }
    case "DELETE": {
      const isownuser = await isOwnUser(req, res);
      if (!isownuser) {
        return res
          .status(403)
          .json({ error: "Users can only unregister themselves for an event" });
      }

      if (req.query.eventId && !isValidObjectId(req.query.eventId))
        return res.status(400).json({
          message: `Invalid event id: ${req.query.eventId as string}`,
        });
      if (req.query.userId && !isValidObjectId(req.query.userId))
        return res
          .status(400)
          .json({ message: `Invalid user id: ${req.query.userId as string}` });

      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;
      const userId = req.query.userId
        ? new Types.ObjectId(req.query.userId as string)
        : undefined;

      const match: Partial<RegistrationInputClient> = {};
      if (eventId) match.eventId = eventId;
      else return res.status(500);
      if (userId) match.userId = userId;
      else return res.status(500);

      await sendRegistrationDeleteEmail(req.query.userId, req.query.eventId);

      return res.status(200).json({
        registration: await Registration.findOneAndDelete(match),
      });
    }
    case "PATCH": {
      const isadmin = await isAdmin(req, res);
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can edit registrations (approve/deny)" });
      }

      try {
        const { registrationId, ...updateData } = req.body as {
          registrationId: string;
          [key: string]: unknown;
        };
        if (!isValidObjectId(registrationId)) {
          return res.status(400).json({
            message: `Invalid registration ID: ${registrationId}`,
          });
        }

        // Validate partial edits with the existing schema, including decision values.
        // Parsing also strips unknown fields and raw MongoDB update operators.
        const result = registrationInputServerValidator
          .partial()
          .safeParse(updateData);
        if (!result.success) {
          return res.status(400).json({ error: result.error });
        }

        const existingRegistration = await Registration.findById(
          registrationId
        );
        if (!existingRegistration) {
          return res.status(404).json({ message: "Registration not found" });
        }

        // Compare and save atomically: only one competing decision can win.
        const updatedRegistration = await Registration.findOneAndUpdate(
          { _id: registrationId, approved: existingRegistration.approved },
          result.data,
          { new: true, runValidators: true }
        );

        if (!updatedRegistration) {
          return res.status(409).json({
            message:
              "Registration changed while saving. Refresh and try again.",
          });
        }

        // Repeated decisions and unrelated edits must not resend decision emails.
        const statusChanged =
          existingRegistration.approved !== updatedRegistration.approved;
        try {
          if (statusChanged && updatedRegistration.approved === "approved") {
            await sendRegistrationApprovedEmail(
              updatedRegistration.userId,
              updatedRegistration.eventId
            );
          } else if (
            statusChanged &&
            updatedRegistration.approved === "denied"
          ) {
            await sendRegistrationDeniedEmail(
              updatedRegistration.userId,
              updatedRegistration.eventId
            );
          }
        } catch (error) {
          // The saved decision remains successful even if its notification fails.
          console.error("Failed to send registration decision email:", {
            registrationId: updatedRegistration._id.toString(),
            status: updatedRegistration.approved,
            error,
          });
        }

        return res.status(200).json({ registration: updatedRegistration });
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
};
