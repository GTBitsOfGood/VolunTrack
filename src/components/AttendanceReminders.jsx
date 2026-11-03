import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAttendanceNeedsReview } from "../queries/attendances";

// Mounted only in the admin home header. This data never comes from the
// calendar's filtered event list; the server scopes it to the current session.
const AttendanceReminders = () => {
  const [shifts, setShifts] = useState([]);
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
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      active.current = false;
      generation.current++;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [refresh]);
  if (!loading && !error && shifts.length === 0) return null;
  return (
    <section
      aria-label="Attendance reminders"
      className="my-4 rounded-lg border border-primaryColor p-4"
    >
      <h2 className="text-lg font-semibold">Attendance needs review</h2>
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
        <ul className="space-y-3">
          {shifts.map((shift) => {
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
                aria-label={`${shift.title}, ${shift.date}: ${total} volunteer${
                  total === 1 ? " needs" : "s need"
                } attendance review.`}
              >
                <p>
                  {shift.title} needs a look: {counts}.
                </p>
                <time dateTime={shift.date}>
                  {new Intl.DateTimeFormat("en-US", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(`${shift.date}T12:00:00Z`))}
                </time>
                {" · "}
                <Link href={`/events/${shift.eventId}/attendance`}>
                  <a
                    className="text-primaryColor underline"
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
    </section>
  );
};
export default AttendanceReminders;
