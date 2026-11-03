import { getServerSession } from "next-auth/next";
import { authOptions } from "../../src/pages/api/auth/[...nextauth]";
import dbConnect from "../mongodb";
import { runAttendanceTransaction } from "./attendanceCorrectionStore";
import type { CorrectionDependencies } from "./attendanceCorrections";

export const attendanceCorrectionDependencies: CorrectionDependencies = {
  async getUser(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return null;
    // The session callback reloads role and organization from the database.
    const user = session.user;
    return {
      _id: user._id.toString(),
      organizationId: user.organizationId?.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },
  async transaction(work) {
    await dbConnect();
    return runAttendanceTransaction(work);
  },
};
