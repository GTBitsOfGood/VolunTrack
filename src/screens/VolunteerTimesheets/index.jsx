import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { getAttendances } from "../../queries/attendances";
import { getRegistrations } from "../../queries/registrations";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import { formatAtlantaDate } from "../../../utils/dates";
import TimesheetCard from "./TimesheetCard";

// Hours typed into the old "Log Hours" form (before clock in and out).
const fromTypedLog = (log) => ({
  id: log._id,
  kind: "typed",
  name:
    log.userId?.firstName != null && log.userId?.lastName != null
      ? `${log.userId.firstName} ${log.userId.lastName}`
      : "—",
  eventName: log.eventId?.eventParent?.title ?? "—",
  tasks: log.eventId?.eventParent?.tasks ?? [],
  date: log.eventId?.date
    ? new Date(log.eventId.date).toISOString().slice(0, 10)
    : formatAtlantaDate(log.inTime),
  start: log.inTime,
  end: log.outTime,
});

// A finished Clock In / Clock Out record, with the tasks chosen at sign-up.
const fromClockRecord = (attendance, tasksBySignUp) => ({
  id: attendance._id,
  kind: "clock",
  name: attendance.volunteerName || "—",
  eventName: attendance.eventName || "—",
  tasks: tasksBySignUp.get(`${attendance.userId}:${attendance.eventId}`) ?? [],
  date: formatAtlantaDate(attendance.checkinTime),
  start: attendance.checkinTime,
  end: attendance.checkoutTime,
});

const VolunteerTimesheets = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [deletingLogId, setDeletingLogId] = useState(null);

  useEffect(() => {
    const organizationId = user.organizationId;
    Promise.all([
      axios
        .get("/api/volunteer-logs")
        .then((response) => response?.data?.logs ?? [])
        .catch(() => []),
      getAttendances({ organizationId }).then(
        (response) => response?.data?.attendances ?? []
      ),
      getRegistrations({ organizationId }).then(
        (response) => response?.data?.registrations ?? []
      ),
    ])
      .then(([logs, attendances, registrations]) => {
        const tasksBySignUp = new Map(
          registrations.map((registration) => [
            `${registration.userId}:${registration.eventId}`,
            registration.tasks ?? [],
          ])
        );
        const clockEntries = attendances
          .filter(
            (attendance) => attendance.checkinTime && attendance.checkoutTime
          )
          .map((attendance) => fromClockRecord(attendance, tasksBySignUp));
        setEntries(
          [...logs.map(fromTypedLog), ...clockEntries].sort(
            (a, b) => new Date(b.start) - new Date(a.start)
          )
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user.organizationId]);

  const onDeleteLog = async (logId) => {
    if (!logId) return;
    setDeletingLogId(logId);
    try {
      await axios.delete("/api/volunteer-logs", {
        params: { logId },
      });
      setEntries((prev) => prev.filter((entry) => entry.id !== logId));
    } finally {
      setDeletingLogId(null);
    }
  };

  const filteredEntries = useMemo(() => {
    if (!searchValue.trim()) return entries;
    const lower = searchValue.toLowerCase().trim();
    return entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(lower) ||
        entry.eventName.toLowerCase().includes(lower) ||
        entry.tasks.join(" ").toLowerCase().includes(lower)
    );
  }, [entries, searchValue]);

  if (loading) {
    return (
      <div className="mx-auto my-2 flex w-3/4 justify-center py-12">
        <p className="text-gray-500">Loading timesheets...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-2 w-3/4 space-y-6">
      <h1 className="my-4 text-3xl font-semibold text-gray-900">
        Volunteer Timesheets
      </h1>

      <div className="flex flex-row items-center justify-between gap-4">
        <span className="text-base font-bold text-gray-600">
          Timesheet History ({filteredEntries.length})
        </span>
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search timesheets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-64 rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-primaryColor focus:outline-none focus:ring-1 focus:ring-primaryColor"
            aria-label="Search timesheets"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <TimesheetCard
              key={`${entry.kind}:${entry.id}`}
              entry={entry}
              onDelete={entry.kind === "typed" ? onDeleteLog : undefined}
              isDeleting={deletingLogId === entry.id}
            />
          ))
        ) : (
          <p className="py-8 text-center text-gray-500">
            No timesheet entries found. Only shifts with both start and end time
            logged are shown.
          </p>
        )}
      </div>
    </div>
  );
};

VolunteerTimesheets.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AdminAuthWrapper(VolunteerTimesheets);
