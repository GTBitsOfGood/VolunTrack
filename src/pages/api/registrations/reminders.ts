import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import { sendEventReminderEmail } from "../../../utils/mailersend-email";
import User from "../../../../server/mongodb/models/User";
import Organization from "../../../../server/mongodb/models/Organization";
import { EventParentDocument } from "../../../../server/mongodb/models/EventParent";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "POST": {
      const { secret, timeRange } = req.body;

      // if (!secret || secret !== process.env.INTERNAL_SECRET) {
      //   return res.status(403).json({ message: "Unauthorized" });
      // }

      const now = new Date();
      const startTime = new Date(
        now.getTime() + timeRange.start * 60 * 60 * 1000
      );
      const endTime = new Date(now.getTime() + timeRange.end * 60 * 60 * 1000);

      try {
        EventParent;
        const events = await Event.find({
          date: { $gte: startTime, $lte: endTime },
        })
          .populate("eventParent")
          .lean();

        const filteredEvents = events.filter((event) => {
          if (!event.eventParent || typeof event.eventParent !== "object") {
            console.error(
              "EventParent is still an ObjectId for event:",
              event._id
            );
            return false;
          }

          return (event.eventParent as unknown as EventParentDocument)
            .sendReminderEmail;
        });

        if (filteredEvents.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No events requiring reminders",
            count: 0,
          });
        }

        const filteredEventIds = filteredEvents.map((event) => event._id);

        const registrations = await Registration.find({
          eventId: { $in: filteredEventIds },
          approved: "approved",
        }).lean();

        const groupedRegistrations = registrations.reduce<{
          [key: string]: {
            eventId: string;
            organizationId: string;
            userIds: string[];
          };
        }>((acc, reg) => {
          const eventIdStr = reg.eventId.toString();
          const organizationIdStr = reg.organizationId.toString();

          if (!acc[eventIdStr]) {
            acc[eventIdStr] = {
              eventId: eventIdStr,
              organizationId: organizationIdStr,
              userIds: [],
            };
          }

          acc[eventIdStr].userIds.push(reg.userId.toString());

          return acc;
        }, {});

        const errors: string[] = [];
        let sent = 0;

        await Promise.all(
          Object.values(groupedRegistrations).map(
            async ({ eventId, organizationId, userIds }) => {
              const event = await Event.findById(eventId)
                .populate("eventParent")
                .lean();
              const organization = await Organization.findById(
                organizationId
              ).lean();

              if (!event || !organization) {
                errors.push(
                  `Event or organization not found for eventId: ${eventId}, organizationId: ${organizationId}`
                );
                return;
              }

              const users = await User.find(
                { _id: { $in: userIds } },
                "email firstName lastName"
              ).lean();

              if (!users || users.length === 0) {
                errors.push(`No users registered under event: ${eventId}`);
                return;
              }

              const results = await Promise.allSettled(
                users.map((user) =>
                  sendEventReminderEmail(user, event, organization)
                )
              );

              results.forEach((result, i) => {
                if (result.status === "fulfilled") {
                  sent++;
                } else {
                  // use the user id, not the email, so the response doesn't leak addresses
                  errors.push(
                    `user ${String(users[i]._id)} (event ${eventId}): ${String(
                      result.reason
                    )}`
                  );
                }
              });
            }
          )
        );

        return res.status(errors.length > 0 ? 500 : 200).json({
          success: errors.length === 0,
          message:
            errors.length === 0
              ? "successfully sent reminders"
              : "some reminders failed to send",
          eventCount: filteredEvents.length,
          registrationCount: registrations.length,
          sent,
          failed: errors.length,
          errors,
        });
      } catch (error) {
        return res.status(500).json({
          error: "An Internal Server Error Occurred: " + String(error),
        });
      }
    }
  }
};
