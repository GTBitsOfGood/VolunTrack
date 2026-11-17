import { getServerSession } from "next-auth/next";
import { authOptions } from "../../src/pages/api/auth/[...nextauth]";
import dbConnect from "../mongodb";
import Registration from "../mongodb/models/Registration";
import type { ClockDependencies } from "./volunteerClock";
import { attendanceStore } from "./attendancePersistence";
import { findShift } from "./attendanceCorrectionStore";

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
  getShift: (eventId) => findShift(eventId),
  async getRegistration(scope) {
    return Registration.findOne(scope).select("approved");
  },
  now: () => new Date(),
};
