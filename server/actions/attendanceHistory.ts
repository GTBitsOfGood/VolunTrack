import type {
  CorrectionActor,
  CorrectionAttendance,
  CorrectionHistory,
} from "./attendanceCorrections";

// Change History is read by admins: Atlanta times like "Sat, Nov 7, 9:40 AM",
// and no database IDs (the history record already stores them in fields).
const atlanta = { timeZone: "America/New_York" } as const;
const dayKey = new Intl.DateTimeFormat("en-US", {
  ...atlanta,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const punchText = new Intl.DateTimeFormat("en-US", {
  ...atlanta,
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const punchTextWithSeconds = new Intl.DateTimeFormat("en-US", {
  ...atlanta,
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});
const clockText = new Intl.DateTimeFormat("en-US", {
  ...atlanta,
  hour: "numeric",
  minute: "2-digit",
});

export const formatHistoryPunch = (value: Date | null): string =>
  value ? punchText.format(value) : "not recorded";

// "Sat, Nov 7, 9:00 AM to 12:00 PM". The day repeats only when it changes.
export const formatHistoryRange = (start: Date, end: Date): string =>
  `${punchText.format(start)} to ${
    dayKey.format(start) === dayKey.format(end)
      ? clockText.format(end)
      : punchText.format(end)
  }`;

type Change = { label: string; from: string; to: string };

const describeChange = (
  label: string,
  before: Date | null,
  after: Date | null
): Change => {
  const from = formatHistoryPunch(before);
  const to = formatHistoryPunch(after);
  // Show seconds only when they are the whole difference.
  return before && after && from === to
    ? {
        label,
        from: punchTextWithSeconds.format(before),
        to: punchTextWithSeconds.format(after),
      }
    : { label, from, to };
};

const describeCorrection = (
  admin: string,
  previous: CorrectionAttendance | null,
  saved: CorrectionAttendance
): string => {
  if (!previous) {
    return saved.checkinTime && saved.checkoutTime
      ? `${admin} added hours for ${saved.volunteerName} at ${
          saved.eventName
        }: ${formatHistoryRange(saved.checkinTime, saved.checkoutTime)}`
      : `${admin} checked in ${saved.volunteerName} at ${
          saved.eventName
        }: ${formatHistoryPunch(saved.checkinTime)}`;
  }
  const changes: Change[] = [];
  if (previous.checkinTime?.getTime() !== saved.checkinTime?.getTime())
    changes.push(
      describeChange("clock-in", previous.checkinTime, saved.checkinTime)
    );
  if (previous.checkoutTime?.getTime() !== saved.checkoutTime?.getTime())
    changes.push(
      describeChange("clock-out", previous.checkoutTime, saved.checkoutTime)
    );
  if (changes.length === 1) {
    const [change] = changes;
    return `${admin} changed ${saved.volunteerName}'s ${change.label} for ${saved.eventName} from ${change.from} to ${change.to}`;
  }
  if (changes.length === 0)
    return `${admin} saved ${saved.volunteerName}'s times for ${saved.eventName} with no changes`;
  return `${admin} changed ${saved.volunteerName}'s times for ${
    saved.eventName
  }: ${changes
    .map((change) => `${change.label} from ${change.from} to ${change.to}`)
    .join(", ")}`;
};

export const buildAttendanceCorrectionHistory = (
  actor: CorrectionActor,
  previous: CorrectionAttendance | null,
  saved: CorrectionAttendance
): CorrectionHistory => ({
  keyword: previous ? "EDITED" : "CREATED",
  userId: actor._id,
  organizationId: saved.organizationId,
  eventId: saved.eventId,
  description: describeCorrection(
    `${actor.firstName} ${actor.lastName}`,
    previous,
    saved
  ),
});
