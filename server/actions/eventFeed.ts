import { Types } from "mongoose";
import { attendanceWallTime, getAtlantaMonthIndex } from "../../utils/dates";
import { attendanceHours } from "../../utils/hours";
import Attendance from "../mongodb/models/Attendance";
import Event from "../mongodb/models/Event";
import EventParent from "../mongodb/models/EventParent";
import Registration from "../mongodb/models/Registration";

// The Events and Home pages used to download every event, sign-up and
// attendance record the organization ever had. These helpers send only what is
// on screen. They filter and sort here, not in the database: the live site's
// database (Azure Cosmos DB) refuses to sort on fields without an index, and
// the old per-event $lookup over the whole events collection was the slow part.

export type OrgEvent = {
  id: string;
  parentId: string;
  dateKey: string; // "YYYY-MM-DD", the shift's calendar day
  date: Date;
  startTime: string;
  endTime: string;
  isPrivate: boolean;
};

type ParentRow = {
  _id: Types.ObjectId;
  isPrivate?: boolean;
  startTime?: string;
  endTime?: string;
};
type EventRow = {
  _id: Types.ObjectId;
  date: Date;
  eventParent: Types.ObjectId;
};

const byDateThenStart = (a: OrgEvent, b: OrgEvent) =>
  a.date.getTime() - b.date.getTime() ||
  a.startTime.localeCompare(b.startTime) ||
  a.id.localeCompare(b.id);

/** Every shift of one organization, in a light form (no descriptions). */
export const loadOrgEvents = async (
  organizationId: Types.ObjectId
): Promise<OrgEvent[]> => {
  const parents = await EventParent.find(
    { organizationId },
    { _id: 1, isPrivate: 1, startTime: 1, endTime: 1 }
  ).lean<ParentRow[]>();
  if (parents.length === 0) return [];
  const parentById = new Map(parents.map((p) => [String(p._id), p]));
  const events = await Event.find(
    { eventParent: { $in: parents.map((p) => p._id) } },
    { _id: 1, date: 1, eventParent: 1 }
  ).lean<EventRow[]>();
  const rows: OrgEvent[] = [];
  for (const event of events) {
    const parent = parentById.get(String(event.eventParent));
    const date = event.date ? new Date(event.date) : null;
    if (!parent || !date || !Number.isFinite(date.getTime())) continue;
    rows.push({
      id: String(event._id),
      parentId: String(event.eventParent),
      dateKey: date.toISOString().slice(0, 10),
      date,
      startTime: parent.startTime ?? "",
      endTime: parent.endTime ?? "",
      isPrivate: !!parent.isPrivate,
    });
  }
  return rows.sort(byDateThenStart);
};

/** "YYYY-MM-DDTHH:mm" read as a wall clock, the way the pages compare times. */
export const wallClock = (value?: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value ?? "");
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
};

/** The browser's wall clock if it sent one, else Atlanta's. */
export const nowWallClockText = (sent?: string): string =>
  wallClock(sent) !== null
    ? (sent as string).slice(0, 16)
    : attendanceWallTime(new Date());

// Same rule the pages used: a shift is upcoming until its end time has passed.
const endsAt = (event: OrgEvent): number => {
  const [hours, minutes] = event.endTime.split(":").map(Number);
  const end = new Date(event.date);
  end.setUTCHours(hours || 0, minutes || 0);
  return end.getTime();
};

/** Sign-ups of one person, by shift: "approved", "pending" or "denied". */
export const loadMySignUps = async (
  userId: Types.ObjectId,
  organizationId: Types.ObjectId
): Promise<Map<string, string>> => {
  const rows = await Registration.find(
    { userId, organizationId },
    { eventId: 1, approved: 1 }
  ).lean<{ eventId: Types.ObjectId; approved?: string }[]>();
  return new Map(
    rows.map((r) => [String(r.eventId), r.approved ?? "approved"])
  );
};

// Admins see every shift. Everyone else sees public shifts plus private ones
// they signed up for (the rule the Events page applied in the browser).
const visibleTo =
  (role: string, mySignUps: Map<string, string>) => (event: OrgEvent) =>
    role === "admin" || !event.isPrivate || mySignUps.has(event.id);

export const FEED_VIEWS = [
  "upcoming",
  "month",
  "all",
  "public",
  "private",
  "day",
  "home",
] as const;
export type FeedView = (typeof FEED_VIEWS)[number];

type FeedInput = {
  all: OrgEvent[];
  role: string;
  mySignUps: Map<string, string>;
  view: FeedView;
  now: string; // "YYYY-MM-DDTHH:mm", wall clock
  day?: string; // "YYYY-MM-DD" for view=day
  month?: string; // "YYYY-MM" for view=month
  page: number;
  pageSize: number;
};

/** Which shifts a list shows, and how many there are in all. */
export const pickFeed = (
  input: FeedInput
): { ids: string[]; total: number } => {
  const { all, role, mySignUps, view, page, pageSize } = input;
  const now = wallClock(input.now) ?? Date.now();
  const visible = all.filter(visibleTo(role, mySignUps));

  if (view === "home") {
    // The Home lists show today's shifts, the next 5 upcoming ones, and for
    // volunteers their next 2 approved sign-ups. Send a little more than that.
    const today = input.now.slice(0, 10);
    const upcoming = visible.filter((e) => endsAt(e) >= now);
    const picked =
      role === "volunteer"
        ? [
            ...upcoming.filter((e) => !mySignUps.has(e.id)).slice(0, 10),
            ...upcoming
              .filter((e) => mySignUps.get(e.id) === "approved")
              .slice(0, 5),
          ]
        : [
            ...visible.filter((e) => e.dateKey === today),
            ...upcoming.slice(0, 10),
          ];
    const ids = [...new Set(picked.sort(byDateThenStart).map((e) => e.id))];
    return { ids, total: ids.length };
  }

  const matches = visible.filter((e) => {
    switch (view) {
      case "upcoming":
        return endsAt(e) >= now;
      case "month":
        return e.dateKey.slice(0, 7) === input.month;
      case "day":
        return e.dateKey === input.day;
      case "public":
        return !e.isPrivate;
      case "private":
        return e.isPrivate;
      default:
        return true;
    }
  });
  const start = page * pageSize;
  return {
    ids: matches.slice(start, start + pageSize).map((e) => e.id),
    total: matches.length,
  };
};

/** Calendar dots: days with shifts (public ones only, for non-admins). */
export const calendarDays = (all: OrgEvent[], role: string): string[] => [
  ...new Set(
    all.filter((e) => role === "admin" || !e.isPrivate).map((e) => e.dateKey)
  ),
];

/** Full shift records for a list, in list order, with the series count. */
export const loadFullEvents = async (ids: string[], all: OrgEvent[]) => {
  if (ids.length === 0) return [];
  const docs = await Event.find({
    _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
  })
    .populate("eventParent")
    .lean();
  const docById = new Map(docs.map((doc) => [String(doc._id), doc]));
  const datesByParent = new Map<string, number[]>();
  for (const e of all) {
    const list = datesByParent.get(e.parentId) ?? [];
    list.push(e.date.getTime());
    datesByParent.set(e.parentId, list);
  }
  const rowById = new Map(all.map((e) => [e.id, e]));
  // Spots taken on each shift (approved sign-ups plus their minors), so the
  // event cards don't each ask the server for their sign-ups.
  const approved = await Registration.find(
    {
      eventId: { $in: ids.map((id) => new Types.ObjectId(id)) },
      approved: "approved",
    },
    { eventId: 1, minors: 1 }
  ).lean<{ eventId: Types.ObjectId; minors?: unknown[] }[]>();
  const spotsTaken = new Map<string, number>();
  for (const signUp of approved) {
    const id = String(signUp.eventId);
    spotsTaken.set(
      id,
      (spotsTaken.get(id) ?? 0) + 1 + (signUp.minors?.length ?? 0)
    );
  }
  return ids.flatMap((id) => {
    const doc = docById.get(id);
    const row = rowById.get(id);
    if (!doc || !row) return [];
    // How many later shifts share this series: the edit and delete forms ask
    // "this shift or the rest of the series?" when it is above 0.
    const recurringEvents = (datesByParent.get(row.parentId) ?? []).filter(
      (time) => time > row.date.getTime()
    ).length;
    return [{ ...doc, recurringEvents, spotsTaken: spotsTaken.get(id) ?? 0 }];
  });
};

/** The numbers and charts at the top of the admin Home page. */
export const homeSummary = async (
  organizationId: Types.ObjectId,
  today: string // "YYYY-MM-DD", the browser's day
) => {
  const all = await loadOrgEvents(organizationId);
  const eventData = new Array<number>(12).fill(0);
  const hoursData = new Array<number>(12).fill(0);
  const attendanceData = new Array<number>(12).fill(0);
  for (const e of all) eventData[Number(e.dateKey.slice(5, 7)) - 1] += 1;

  const todays = all.filter((e) => e.dateKey === today);
  const todaysSignUps = todays.length
    ? await Registration.find(
        { eventId: { $in: todays.map((e) => new Types.ObjectId(e.id)) } },
        { _id: 1 }
      ).lean()
    : [];

  const attendances = await Attendance.find(
    { organizationId },
    { checkinTime: 1, checkoutTime: 1, minutes: 1 }
  ).lean<
    {
      checkinTime?: Date | null;
      checkoutTime?: Date | null;
      minutes?: number;
    }[]
  >();
  let hoursTotal = 0;
  let attendanceTotal = 0;
  for (const attendance of attendances) {
    const month = getAtlantaMonthIndex(attendance.checkinTime);
    if (month < 0) continue;
    const hours = attendanceHours(attendance);
    hoursData[month] += hours;
    hoursTotal += hours;
    attendanceData[month] += 1;
    attendanceTotal += 1;
  }

  const first = all[0]?.dateKey;
  return {
    firstDate: first
      ? `${first.slice(5, 7)}/${first.slice(8, 10)}/${first.slice(0, 4)}`
      : "",
    todaysEvents: todays.length,
    todaysRegistrations: todaysSignUps.length,
    eventTotal: all.length,
    attendanceTotal,
    hoursTotal,
    eventData,
    hoursData,
    attendanceData,
  };
};
