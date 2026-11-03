import type {
  CorrectionActor,
  CorrectionAttendance,
  CorrectionHistory,
} from "./attendanceCorrections";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
});
const punch = (value: Date | null) => {
  if (!value) return "not recorded";
  const parts = formatter.formatToParts(value);
  const field = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "unknown";
  return `${field("year")}-${field("month")}-${field("day")} ${field(
    "hour"
  )}:${field("minute")}:${field("second")} ${field("timeZoneName")}`;
};

export const buildAttendanceCorrectionHistory = (
  actor: CorrectionActor,
  previous: CorrectionAttendance | null,
  saved: CorrectionAttendance
): CorrectionHistory => {
  const changes: string[] = [];
  for (const key of ["checkinTime", "checkoutTime"] as const) {
    if (!previous || previous[key]?.getTime() !== saved[key]?.getTime()) {
      changes.push(
        `${key === "checkinTime" ? "check-in" : "checkout"}: ${punch(
          previous?.[key] ?? null
        )} → ${punch(saved[key])}`
      );
    }
  }
  return {
    keyword: previous ? "EDITED" : "CREATED",
    userId: actor._id,
    organizationId: saved.organizationId,
    eventId: saved.eventId,
    description: `${actor.firstName} ${actor.lastName} (${actor._id}) ${
      previous ? "edited attendance" : "Added hours"
    } for ${saved.volunteerName} (${saved.userId}) at ${saved.eventName} (${
      saved.eventId
    }); attendance ${saved._id}; America/New_York; ${changes.join("; ")}`,
  };
};
