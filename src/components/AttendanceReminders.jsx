import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAttendanceNeedsReview } from "../queries/attendances";
import PaginationComp from "./PaginationComp";

// 5 shifts at a time, newest first, so the box stays the same size however
// many shifts need a look.
const PAGE_SIZE = 5;

// Mounted only in the admin home header. This data never comes from the
// calendar's filtered event list; the server scopes it to the current session.
const AttendanceReminders = () => {
  const [shifts, setShifts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const active = useRef(false);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const response = await getAttendanceNeedsReview();
      if (response.error || !Array.isArray(response.data?.shifts))
        throw new Error("Attendance reminders were not returned.");
      if (active.current && request === generation.current)
        setShifts(response.data.shifts);
    } catch {
      if (active.current && request === generation.current)
        setError(
          "Could not load attendance reminders. Please retry; attendance may still need review."
        );
    } finally {
      if (active.current && request === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    active.current = true;
    refresh();
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      active.current = false;
      generation.current++;
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [refresh]);
  if (!loading && !error && shifts.length === 0) return null;
  // Newest first: recent shifts are the ones an admin can still fix.
  const newestFirst = [...shifts].sort(
    (a, b) => b.date.localeCompare(a.date) || b.eventId.localeCompare(a.eventId)
  );
  const lastPage = Math.max(0, Math.ceil(newestFirst.length / PAGE_SIZE) - 1);
  const current = Math.min(page, lastPage);
  const shown = newestFirst.slice(
    current * PAGE_SIZE,
    (current + 1) * PAGE_SIZE
  );
  return (
    <section
      aria-label="Attendance reminders"
      className="my-4 rounded-lg border border-primaryColor p-4"
    >
      <h2 className="text-lg font-semibold">
        Attendance needs review
        {shifts.length > 0 ? ` (${shifts.length})` : ""}
      </h2>
      {loading && <p role="status">Loading attendance reminders…</p>}
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="text-primaryColor underline"
            disabled={loading}
            onClick={refresh}
          >
            Retry attendance reminders
          </button>
        </div>
      ) : (
        <ul className="mb-0 mt-2">
          {shown.map((shift) => {
            const total =
              shift.missingCheckinCount + shift.missingCheckoutCount;
            const counts = [
              shift.missingCheckoutCount > 0
                ? `${shift.missingCheckoutCount} didn't clock out`
                : null,
              shift.missingCheckinCount > 0
                ? `${shift.missingCheckinCount} didn't clock in`
                : null,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <li
                key={shift.eventId}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-gray-200 py-2 last:border-b-0"
                aria-label={`${shift.title}, ${shift.date}: ${total} volunteer${
                  total === 1 ? " needs" : "s need"
                } attendance review.`}
              >
                <p className="mb-0">
                  <time dateTime={shift.date} className="font-semibold">
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone: "UTC",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(`${shift.date}T12:00:00Z`))}
                  </time>
                  {" · "}
                  {shift.title}
                  {" · "}
                  <span className="text-red-700">{counts}</span>
                </p>
                <Link href={`/events/${shift.eventId}/attendance`}>
                  <a
                    className="whitespace-nowrap text-primaryColor underline"
                    aria-label={`Review attendance for ${shift.title} on ${shift.date}`}
                  >
                    Review attendance
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {!error && newestFirst.length > PAGE_SIZE && (
        <PaginationComp
          items={newestFirst}
          pageSize={PAGE_SIZE}
          currentPage={current}
          updatePageCallback={setPage}
          ariaLabel="Attendance review pages"
        />
      )}
    </section>
  );
};
export default AttendanceReminders;
