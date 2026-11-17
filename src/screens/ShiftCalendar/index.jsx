import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import BoGButton from "../../components/BoGButton";
import Text from "../../components/Text";
import { getShiftCalendar } from "../../queries/shiftCalendar";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import {
  DAY_MS,
  addWeeks,
  atlantaToday,
  formatDay,
  formatTime,
  fromDay,
  sundayOnOrBefore,
  toDay,
} from "./weekDates";

const ShiftCalendar = () => {
  const [weekStart, setWeekStart] = useState(() =>
    sundayOnOrBefore(atlantaToday())
  );
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const exportRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getShiftCalendar(weekStart).then((result) => {
      if (cancelled) return;
      if (result?.data?.days) {
        setDays(result.data.days);
      } else {
        setDays([]);
        setError("Could not load the shift calendar.");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  const shiftWeek = (weeks) =>
    setWeekStart((current) => addWeeks(current, weeks));
  const goToThisWeek = () => setWeekStart(sundayOnOrBefore(atlantaToday()));

  const downloadImage = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    setExportError(null);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `shift-calendar-${weekStart}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setExportError("Could not create the image. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const weekEnd = toDay(fromDay(weekStart) + 6 * DAY_MS);

  return (
    <div className="relative left-[10%] w-[80%] max-w-[96rem] py-3">
      <Text text="Shift Calendar" type="header" />

      <div className="mb-3 mt-2 flex flex-wrap items-center gap-2">
        <BoGButton
          text="Previous week"
          outline={true}
          onClick={() => shiftWeek(-1)}
        />
        <BoGButton text="This week" outline={true} onClick={goToThisWeek} />
        <BoGButton
          text="Next week"
          outline={true}
          onClick={() => shiftWeek(1)}
        />
        <BoGButton
          text={exporting ? "Creating image..." : "Download as image"}
          onClick={downloadImage}
          disabled={loading || !!error || exporting}
        />
      </div>
      {exportError && <Text text={exportError} className="mb-2 text-red-500" />}

      {loading && <Text text="Loading..." />}
      {error && <Text text={error} className="text-red-500" />}

      {/* Everything inside this div is what gets saved as the picture */}
      <div ref={exportRef} className="bg-white pb-2">
        <Text
          text={`Shift Calendar: ${formatDay(weekStart)} - ${formatDay(
            weekEnd
          )}`}
          type="subtitle"
          className="mb-2 text-primaryColor"
        />
        {!loading &&
          !error &&
          days.map((day) => (
            <div key={day.date} className="mb-3 rounded-xl bg-grey px-6 py-3">
              <Text text={formatDay(day.date)} type="subtitle" />
              {day.shifts.length === 0 ? (
                <Text text="No shifts" className="text-darkGrey" />
              ) : (
                day.shifts.map((shift) => (
                  <div key={shift.eventId} className="mt-2">
                    <p className="mb-0 text-lg font-bold">{shift.title}</p>
                    <p className="mb-0">
                      {formatTime(shift.startTime)} -{" "}
                      {formatTime(shift.endTime)} ET
                    </p>
                    <p className="mb-0">
                      {shift.filled} of {shift.maxVolunteers} filled ·{" "}
                      {shift.open} open
                    </p>
                    <p className="mb-0">
                      {shift.volunteers.length > 0
                        ? shift.volunteers.join(", ")
                        : "No volunteers yet"}
                      {shift.minorsCount > 0 &&
                        ` +${shift.minorsCount} minor${
                          shift.minorsCount === 1 ? "" : "s"
                        }`}
                    </p>
                  </div>
                ))
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminAuthWrapper(ShiftCalendar);
