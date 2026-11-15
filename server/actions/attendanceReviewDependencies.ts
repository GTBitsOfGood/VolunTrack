import dbConnect from "../mongodb";
import { attendanceCorrectionDependencies } from "./attendanceCorrectionDependencies";
import {
  runNoShowTransaction,
  loadAttendanceReview,
} from "./attendanceReviewStore";
import type {
  AttendanceReviewDependencies,
  NoShowDependencies,
} from "./attendanceReview";

export const noShowDependencies: NoShowDependencies = {
  getUser: attendanceCorrectionDependencies.getUser,
  now: () => new Date(),
  async transaction(work) {
    await dbConnect();
    return runNoShowTransaction(work);
  },
};

export const attendanceReviewDependencies: AttendanceReviewDependencies = {
  getUser: attendanceCorrectionDependencies.getUser,
  now: () => new Date(),
  async loadReview(organizationId, now) {
    await dbConnect();
    return loadAttendanceReview(organizationId, now);
  },
};
