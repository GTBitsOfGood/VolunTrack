import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import Event from "../../../../server/mongodb/models/Event";
import EventParent from "../../../../server/mongodb/models/EventParent";
import Registration from "../../../../server/mongodb/models/Registration";
import { sendEventReminderEmail } from "../../../utils/mailersend-email";
import User from "../../../../server/mongodb/models/User";
import Organization from "../../../../server/mongodb/models/Organization";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
  
    switch (req.method) {
        case "POST": {

            const { secret, timeRange } = req.body;


            if (!secret || secret !== process.env.INTERNAL_SECRET) {
                return res.status(403).json({ message: "Unauthorized" });
            }


            const now = new Date();
            const startTime = new Date(now.getTime() + timeRange.start * 60 * 60 * 1000); 
            const endTime = new Date(now.getTime() + timeRange.end * 60 * 60 * 1000); 

            try {
                const events = await Event.find({
                    date: { $gte: startTime, $lte: endTime },
                }).populate('eventParent', 'sendReminderEmail').lean();

                const filteredEvents = events.filter(event => event.eventParent?.sendReminderEmail);

                if (filteredEvents.length === 0) {
                    return res.status(200).json({ message: "No events requiring reminders", count: 0 });
                }

                const filteredEventIds = filteredEvents.map(event => event._id);

                const registrations = await Registration.find({
                    eventId: { $in: filteredEventIds }
                }).lean(); 
                
                const groupedRegistrations = registrations.reduce((acc, reg) => {
                    const eventIdStr = reg.eventId.toString();
                    const organizationIdStr = reg.organizationId.toString();
                
                    if (!acc[eventIdStr]) {
                        acc[eventIdStr] = { 
                            eventId: eventIdStr, 
                            organizationId: organizationIdStr, 
                            userIds: [] 
                        };
                    }
                
                    acc[eventIdStr].userIds.push(reg.userId.toString());
                
                    return acc;
                }, {} as Record<string, { eventId: string, organizationId: string, userIds: string[] }>);
                

                await Promise.all(
                    Object.values(groupedRegistrations).map(async ({ eventId, organizationId, userIds }) => {
                        const event = await Event.findById(eventId).populate("eventParent").lean();
                        const organization = await Organization.findById(organizationId).lean();
                
                        if (!event || !organization) {
                            console.error(`Error: Missing event (${eventId}) or organization (${organizationId})`);
                            return {
                                status: 404,
                                message: `Event or organization not found for eventId: ${eventId}, organizationId: ${organizationId}`
                            };
                        }
                
                        const users = await User.find({ _id: { $in: userIds } }, "email firstName lastName").lean();
                
                        if (!users || users.length === 0) {
                            console.error(`Error: No user registered under event (${eventId}) `);
                            return {
                                status: 404, 
                                message: `No users registered under event: ${eventId}`
                            };
                        }
                
                        await Promise.all(users.map(user => sendEventReminderEmail(user, event, organization)));
                    })
                );
                
                return res.status(200).json({ 
                    message: "successfully sent reminders", 
                    eventCount: filteredEvents.length, 
                    registrationCount: registrations.length 
                });


            } catch (error) {
                console.error("error sending reminders:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

    }
};