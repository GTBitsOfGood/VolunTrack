import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import TimesheetCard from "./TimesheetCard";

const VolunteerTimesheets = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [deletingLogId, setDeletingLogId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/volunteer-logs")
      .then((response) => {
        if (response?.data?.logs) {
          setLogs(response.data.logs);
        }
      })
      .catch(() => {
        setLogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onDeleteLog = async (logId) => {
    if (!logId) return;
    setDeletingLogId(logId);
    try {
      await axios.delete("/api/volunteer-logs", {
        params: { logId },
      });
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== logId));
    } finally {
      setDeletingLogId(null);
    }
  };

  const filteredLogs = useMemo(() => {
    if (!searchValue.trim()) return logs;
    const lower = searchValue.toLowerCase().trim();
    return logs.filter((log) => {
      const contactName =
        log.userId?.firstName != null && log.userId?.lastName != null
          ? `${log.userId.firstName} ${log.userId.lastName}`.toLowerCase()
          : "";
      const eventName = (log.eventId?.eventParent?.title ?? "").toLowerCase();
      const tasks = log.eventId?.eventParent?.tasks ?? [];
      const tasksStr = (
        Array.isArray(tasks) ? tasks.join(" ") : ""
      ).toLowerCase();
      return (
        contactName.includes(lower) ||
        eventName.includes(lower) ||
        tasksStr.includes(lower)
      );
    });
  }, [logs, searchValue]);

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
          Timesheet History ({filteredLogs.length})
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
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <TimesheetCard
              key={log._id}
              log={log}
              onDelete={onDeleteLog}
              isDeleting={deletingLogId === log._id}
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

export default AdminAuthWrapper(VolunteerTimesheets);
