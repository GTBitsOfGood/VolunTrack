export type AttendanceIssue = "missingCheckin" | "missingCheckout" | null;

type AttendancePunches = {
  checkinTime?: Date | string | null;
  checkoutTime?: Date | string | null;
};

type AttendanceIssueInput = {
  approved?: string;
  noShow?: boolean;
  attendances: readonly AttendancePunches[];
  shiftEnd: Date;
  now: Date;
};

// Classify once per volunteer/shift, using every associated attendance record.
// The caller obtains shiftEnd from getShiftDateTimes, never from isEnded.
export const getAttendanceIssue = ({
  approved,
  noShow,
  attendances,
  shiftEnd,
  now,
}: AttendanceIssueInput): AttendanceIssue => {
  if (approved !== "approved" || noShow === true || !(now > shiftEnd)) {
    return null;
  }
  if (attendances.length === 0) return "missingCheckin";
  return attendances.some(
    (attendance) =>
      attendance.checkinTime != null && attendance.checkoutTime == null
  )
    ? "missingCheckout"
    : null;
};

// Call with registrations for one shift. Duplicate approved registrations must
// not make a no-show volunteer reappear in waiting rows or reminder counts.
export const getNoShowVolunteerIds = (
  registrations: readonly {
    userId: { toString(): string };
    approved?: string;
    noShow?: boolean;
  }[]
): Set<string> =>
  new Set(
    registrations
      .filter(
        (registration) =>
          registration.approved === "approved" && registration.noShow === true
      )
      .map((registration) => registration.userId.toString())
  );
