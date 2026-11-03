import { createAttendanceReviewHandler } from "../../../../server/actions/attendanceReview";
import { attendanceReviewDependencies } from "../../../../server/actions/attendanceReviewDependencies";

export default createAttendanceReviewHandler(attendanceReviewDependencies);
