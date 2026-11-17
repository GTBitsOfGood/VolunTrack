import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import PaginationComp from "../../components/PaginationComp";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import TimesheetCard from "./TimesheetCard";

const PAGE_SIZE = 20;

// The server builds the list (typed hours plus finished Clock In / Clock Out
// records), searches it and sends one page at a time
// (GET /api/volunteer-logs/timesheets). The page used to download every record
// of the organization and show them all at once.
const VolunteerTimesheets = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [deletingLogId, setDeletingLogId] = useState(null);

  const load = (nextPage, nextSearch) =>
    axios
      .get("/api/volunteer-logs/timesheets", {
        params: { page: nextPage, pageSize: PAGE_SIZE, search: nextSearch },
      })
      .then((response) => {
        setEntries(response.data.entries ?? []);
        setTotal(response.data.total ?? 0);
        setPage(response.data.page ?? 0);
        setLoadError("");
      })
      .catch(() => {
        setLoadError("Timesheets didn't load. Refresh the page to try again.");
      })
      .finally(() => {
        setLoading(false);
      });

  // Search after typing stops for a moment, from the first page.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchValue.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    load(0, search);
  }, [user.organizationId, search]);

  const onDeleteLog = async (logId) => {
    if (!logId) return;
    setDeletingLogId(logId);
    try {
      await axios.delete("/api/volunteer-logs", {
        params: { logId },
      });
      await load(page, search);
    } finally {
      setDeletingLogId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto my-2 flex w-11/12 justify-center py-12 md:w-3/4">
        <p className="text-gray-500">Loading timesheets...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-2 w-11/12 space-y-6 md:w-3/4">
      <h1 className="my-4 text-3xl font-semibold text-gray-900">
        Volunteer Timesheets
      </h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="text-base font-bold text-gray-600">
          Timesheet History ({total})
        </span>
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search timesheets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-primaryColor focus:outline-none focus:ring-1 focus:ring-primaryColor"
            aria-label="Search timesheets"
          />
        </div>
      </div>

      {loadError && (
        <p role="alert" className="font-semibold text-red-600">
          {loadError}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
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
      {total > PAGE_SIZE && (
        <PaginationComp
          items={entries}
          totalItems={total}
          pageSize={PAGE_SIZE}
          currentPage={page}
          updatePageCallback={(nextPage) => load(nextPage, search)}
          ariaLabel="Timesheet pages"
        />
      )}
    </div>
  );
};

VolunteerTimesheets.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AdminAuthWrapper(VolunteerTimesheets);
