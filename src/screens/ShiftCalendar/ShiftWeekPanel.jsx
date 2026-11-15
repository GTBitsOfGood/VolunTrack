import { toPng } from "html-to-image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { getShiftCalendar } from "../../queries/shiftCalendar";
import {
  DAY_MS,
  addWeeks,
  atlantaToday,
  fromDay,
  formatTime,
  localDay,
  shortDay,
  sundayOnOrBefore,
  toDay,
} from "./weekDates";

// One week of shifts, shown under the month calendar on the Events page.
// It uses the same data as the full Shift Calendar page.
const ShiftWeekPanel = ({ selectedDate }) => {
  const [weekStart, setWeekStart] = useState(() =>
    sundayOnOrBefore(selectedDate ? localDay(selectedDate) : atlantaToday())
  );
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef(null);

  // Clicking a day on the month calendar shows that day's week here.
  useEffect(() => {
    if (selectedDate) setWeekStart(sundayOnOrBefore(localDay(selectedDate)));
  }, [selectedDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getShiftCalendar(weekStart).then((result) => {
      if (cancelled) return;
      if (result?.data?.days) setDays(result.data.days);
      else {
        setDays([]);
        setError("Could not load shifts.");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  const downloadImage = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `shift-calendar-${weekStart}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const weekEnd = toDay(fromDay(weekStart) + 6 * DAY_MS);
  const busyDays = days.filter((day) => day.shifts.length > 0);
  const linkClass =
    "text-sm text-primaryColor underline disabled:no-underline disabled:opacity-50";

  return (
    <section
      aria-label="Shifts by week"
      className="mt-4 w-full rounded-xl bg-grey p-3 md:max-w-[22vw]"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className={linkClass}
          onClick={() => setWeekStart((week) => addWeeks(week, -1))}
        >
          ‹ Prev week
        </button>
        <button
          type="button"
          className={linkClass}
          onClick={() => setWeekStart(sundayOnOrBefore(atlantaToday()))}
        >
          This week
        </button>
        <button
          type="button"
          className={linkClass}
          onClick={() => setWeekStart((week) => addWeeks(week, 1))}
        >
          Next week ›
        </button>
      </div>

      {/* Everything in this box is what the picture shows */}
      <div ref={exportRef} className="rounded-lg bg-white p-2">
        <p className="mb-1 text-sm font-bold text-primaryColor">
          Shifts: {shortDay(weekStart)} – {shortDay(weekEnd)}
        </p>
        {loading && <p className="mb-0 text-sm">Loading…</p>}
        {error && <p className="mb-0 text-sm text-red-500">{error}</p>}
        {!loading && !error && busyDays.length === 0 && (
          <p className="mb-0 text-sm text-darkGrey">No shifts this week</p>
        )}
        {!loading &&
          !error &&
          busyDays.map((day) => (
            <div key={day.date} className="border-t border-gray-200 py-1">
              <p className="mb-0 text-xs font-bold uppercase text-darkGrey">
                {shortDay(day.date)}
              </p>
              {day.shifts.map((shift) => (
                <div key={shift.eventId} className="mb-1 text-sm leading-snug">
                  <p className="mb-0 font-semibold">{shift.title}</p>
                  <p className="mb-0">
                    {formatTime(shift.startTime)}–{formatTime(shift.endTime)} ET
                    · {shift.filled} of {shift.maxVolunteers} filled
                  </p>
                  <p className="mb-0 text-darkGrey">
                    {shift.volunteers.length > 0
                      ? shift.volunteers.join(", ")
                      : "No volunteers yet"}
                    {shift.minorsCount > 0 &&
                      ` +${shift.minorsCount} minor${
                        shift.minorsCount === 1 ? "" : "s"
                      }`}
                  </p>
                </div>
              ))}
            </div>
          ))}
      </div>

      <div className="mt-2 flex justify-center gap-4">
        <Link href="/shift-calendar">
          <a className={linkClass}>Full view</a>
        </Link>
        <button
          type="button"
          className={linkClass}
          disabled={loading || !!error || exporting}
          onClick={downloadImage}
        >
          {exporting ? "Saving…" : "Download as image"}
        </button>
      </div>
    </section>
  );
};

ShiftWeekPanel.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
};

export default ShiftWeekPanel;
