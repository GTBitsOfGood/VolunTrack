import { getAttendanceIssue, getNoShowVolunteerIds } from "./attendance";
import { getShiftDateTimes } from "./dates";

type Person = {
  _id: string;
  organizationId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};
type Registration = {
  _id: string;
  userId: string;
  eventId: string;
  organizationId: string;
  approved?: string;
  noShow?: boolean;
  minors?: unknown[];
};
type Record = {
  _id: string;
  userId: string;
  eventId: string;
  organizationId: string;
  checkinTime?: string | Date | null;
  checkoutTime?: string | Date | null;
  volunteerName?: string;
  volunteerEmail?: string;
};
type Shift = {
  _id: string;
  date: string | Date;
  eventParent: { organizationId: string; startTime: string; endTime: string };
};
export const getEndEventCheckout = (event: Shift, now: Date): Date => {
  const { end } = getShiftDateTimes(
    event.date,
    event.eventParent.startTime,
    event.eventParent.endTime
  );
  return new Date(Math.min(now.getTime(), end.getTime()));
};
export const getAttendanceManagementRows = ({
  event,
  users,
  registrations,
  attendances,
  now,
}: {
  event: Shift;
  users: Person[];
  registrations: Registration[];
  attendances: Record[];
  now: Date;
}) => {
  const org = String(event.eventParent.organizationId);
  const belongs = (item: { eventId: string; organizationId: string }) =>
    String(item.eventId) === String(event._id) &&
    String(item.organizationId) === org;
  const regs = registrations.filter(belongs);
  const records = attendances.filter(belongs);
  const noShows = getNoShowVolunteerIds(regs);
  const approved = regs.filter((r) => r.approved === "approved");
  const ids = new Set([
    ...approved
      .filter((r) => !noShows.has(String(r.userId)))
      .map((r) => String(r.userId)),
    ...records.map((r) => String(r.userId)),
  ]);
  const { end } = getShiftDateTimes(
    event.date,
    event.eventParent.startTime,
    event.eventParent.endTime
  );
  return [...ids]
    .map((id) => {
      const entries = records.filter((r) => String(r.userId) === id);
      const registration = approved.find((r) => String(r.userId) === id);
      const volunteer = users.find(
        (u) => String(u._id) === id && String(u.organizationId) === org
      ) ?? {
        _id: id,
        firstName: entries[0]?.volunteerName ?? "Unavailable volunteer",
        email: entries[0]?.volunteerEmail,
      };
      const openRecords = entries.filter(
        (r) => r.checkinTime != null && r.checkoutTime == null
      );
      return {
        volunteer,
        registrationId: registration?._id,
        minors: registration?.minors ?? [],
        records: entries,
        openRecords,
        status: openRecords.length
          ? "checkedIn"
          : entries.some((r) => r.checkoutTime != null)
          ? "checkedOut"
          : "waiting",
        issue: getAttendanceIssue({
          approved: registration?.approved,
          noShow: noShows.has(id),
          attendances: entries,
          shiftEnd: end,
          now,
        }),
      };
    })
    .sort((a, b) =>
      `${a.volunteer.lastName ?? ""} ${a.volunteer.firstName ?? ""} ${
        a.volunteer._id
      }`.localeCompare(
        `${b.volunteer.lastName ?? ""} ${b.volunteer.firstName ?? ""} ${
          b.volunteer._id
        }`
      )
    );
};
