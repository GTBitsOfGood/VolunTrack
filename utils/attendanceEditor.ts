import {
  atlantaDateTimeToInstant,
  getShiftDateTimes,
  instantToAtlantaDateTime,
} from "./dates";

type EditorContext = {
  event: {
    date: Date | string;
    eventParent: { startTime: string; endTime: string };
  };
  attendance?: {
    checkinTime?: Date | string | null;
    checkoutTime?: Date | string | null;
    volunteerName?: string;
    volunteerEmail?: string;
  } | null;
  volunteer?: { firstName?: string; lastName?: string; email?: string } | null;
};
export type AttendanceEditorValues = {
  day: string;
  checkin: string;
  checkout: string;
  name: string;
  email: string;
  confirmDateChange: boolean;
};
export type AttendanceEditorState = {
  initialValues: AttendanceEditorValues;
  notices: string[];
  hasConflictingDates: boolean;
  originalCheckin: Date | null;
  originalCheckout: Date | null;
};
const recordedPunch = (value?: Date | string | null) => {
  if (value == null) return null;
  const instant =
    value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (!Number.isFinite(instant.getTime()))
    throw new RangeError(
      "A recorded punch is invalid. Review the attendance record before editing."
    );
  return instant;
};

export const getAttendanceEditorState = ({
  event,
  attendance,
  volunteer,
}: EditorContext): AttendanceEditorState => {
  const { start, end } = getShiftDateTimes(
    event.date,
    event.eventParent.startTime,
    event.eventParent.endTime
  );
  const scheduledStart = instantToAtlantaDateTime(start);
  const scheduledEnd = instantToAtlantaDateTime(end);
  const originalCheckin = recordedPunch(attendance?.checkinTime);
  const originalCheckout = recordedPunch(attendance?.checkoutTime);
  const checkin = originalCheckin
    ? instantToAtlantaDateTime(originalCheckin)
    : null;
  const checkout = originalCheckout
    ? instantToAtlantaDateTime(originalCheckout)
    : null;
  const day = checkin?.day ?? checkout?.day ?? scheduledStart.day;
  const hasConflictingDates = Boolean(
    checkin && checkout && checkin.day !== checkout.day
  );
  const notices: string[] = [];
  if (
    hasConflictingDates ||
    (checkin && checkin.day !== scheduledStart.day) ||
    (checkout && checkout.day !== scheduledStart.day)
  ) {
    notices.push(
      `Recorded punch dates in Atlanta: check-in ${
        checkin?.day ?? "not recorded"
      }, checkout ${
        checkout?.day ?? "not recorded"
      }. The shift is scheduled for ${scheduledStart.day}.`
    );
  }
  if (hasConflictingDates)
    notices.push(
      "The recorded punches use different dates. Saving this form puts both punches on the selected date; confirm that this is intended."
    );
  if (!attendance)
    notices.push(
      "No attendance is recorded. The initial date and times come from the shift schedule."
    );
  else if (!originalCheckout)
    notices.push(
      "Checkout is not recorded. Its initial time is the scheduled shift end."
    );
  return {
    originalCheckin,
    originalCheckout,
    hasConflictingDates,
    notices,
    initialValues: {
      day,
      checkin: checkin?.time ?? scheduledStart.time,
      checkout: checkout?.time ?? scheduledEnd.time,
      name:
        attendance?.volunteerName ??
        `${volunteer?.firstName ?? ""} ${volunteer?.lastName ?? ""}`.trim(),
      email: attendance?.volunteerEmail ?? volunteer?.email ?? "",
      confirmDateChange: false,
    },
  };
};

const normalizedTime = (time: string) =>
  time.length === 5 ? `${time}:00` : time;
const resolvePunch = (
  day: string,
  time: string,
  previous: Date | null
): Date => {
  if (!/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(time))
    throw new RangeError("Enter a valid time, including seconds if needed.");
  const original = previous ? instantToAtlantaDateTime(previous) : null;
  const unchangedTime =
    original && normalizedTime(time) === normalizedTime(original.time);
  // A real unchanged punch is already unambiguous, including a repeated DST hour.
  if (previous && original?.day === day && unchangedTime)
    return new Date(previous.getTime());
  const minute = atlantaDateTimeToInstant(day, time.slice(0, 5));
  const seconds = Number(time.split(":")[2] ?? 0);
  const milliseconds =
    previous && unchangedTime ? previous.getUTCMilliseconds() : 0;
  return new Date(minute.getTime() + seconds * 1000 + milliseconds);
};

export const getAttendanceEditorPunches = (
  values: Pick<AttendanceEditorValues, "day" | "checkin" | "checkout">,
  state: AttendanceEditorState
) => {
  const checkinTime = resolvePunch(
    values.day,
    values.checkin,
    state.originalCheckin
  );
  const checkoutTime = resolvePunch(
    values.day,
    values.checkout,
    state.originalCheckout
  );
  if (checkoutTime < checkinTime)
    throw new RangeError(
      "Checkout must be at or after check-in on the selected Atlanta date."
    );
  return {
    checkinTime,
    checkoutTime,
    minutes: Math.round(
      (checkoutTime.getTime() - checkinTime.getTime()) / 60000
    ),
  };
};

export const validateAttendanceEditorValues = (
  values: Partial<AttendanceEditorValues>,
  state: AttendanceEditorState
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  const day = values.day ?? "";
  if (!day) errors.day = "Choose an Atlanta date.";
  else {
    try {
      atlantaDateTimeToInstant(day, "12:00");
    } catch {
      errors.day = "Choose a valid Atlanta calendar date.";
    }
  }
  let checkin: Date | undefined;
  let checkout: Date | undefined;
  for (const key of ["checkin", "checkout"] as const) {
    const time = values[key];
    if (!time)
      errors[key] = `Enter a ${
        key === "checkin" ? "check-in" : "checkout"
      } time.`;
    else if (!errors.day) {
      try {
        const resolved = resolvePunch(
          day,
          time,
          key === "checkin" ? state.originalCheckin : state.originalCheckout
        );
        if (key === "checkin") checkin = resolved;
        else checkout = resolved;
      } catch (error) {
        errors[key] =
          error instanceof Error
            ? error.message
            : "Enter a valid Atlanta time.";
      }
    }
  }
  if (checkin && checkout && checkout < checkin)
    errors.checkout =
      "Checkout must be at or after check-in on the selected Atlanta date.";
  if (state.hasConflictingDates && values.confirmDateChange !== true)
    errors.confirmDateChange =
      "Confirm that both punches should use the selected date.";
  return errors;
};
