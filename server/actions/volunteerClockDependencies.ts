import { getServerSession } from "next-auth/next";
import { authOptions } from "../../src/pages/api/auth/[...nextauth]";
import dbConnect from "../mongodb";
import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import Registration from "../mongodb/models/Registration";
import type { ClockDependencies } from "./volunteerClock";
import { attendanceStore } from "./attendancePersistence";

export const volunteerClockDependencies: ClockDependencies = {
  ...attendanceStore,
  async getUser(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return null;
    // The existing session callback reloads this user from MongoDB
    const user = session.user;
    return {
      _id: user._id.toString(),
      organizationId: user.organizationId?.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  },
  async connect() {
    await dbConnect();
  },
  async getShift(eventId) {
    const event = await Event.findById(eventId);
    if (!event) return null;
    const parent = await EventParent.findById(event.eventParent);
    if (!parent) return null;
    return {
      _id: event._id.toString(),
      date: event.date,
      organizationId: parent.organizationId.toString(),
      title: parent.title,
      startTime: parent.startTime,
      endTime: parent.endTime,
    };
  },
  async getRegistration(scope) {
    return Registration.findOne(scope).select("approved");
  },
  now: () => new Date(),
};
