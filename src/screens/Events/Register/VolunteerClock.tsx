import { useCallback, useEffect, useRef, useState } from "react";
import {
  clockInForShift,
  clockOutForShift,
  getMyAttendance,
  VolunteerClockStatus,
} from "../../../queries/attendances";

const formatTime = (time: string) =>
  new Date(time).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

const VolunteerClock = ({ eventId }: { eventId: string }) => {
  const [status, setStatus] = useState<VolunteerClockStatus | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const mounted = useRef(false);
  const busy = useRef(false);
  const requestVersion = useRef(0);

  const refresh = useCallback(
    async (clearError = true) => {
      const version = ++requestVersion.current;
      setRefreshing(true);
      const result = await getMyAttendance(eventId);
      if (!mounted.current || version !== requestVersion.current) return;
      if ("error" in result) {
        setError(result.error);
      } else {
        setStatus(result.data);
        if (clearError) setError("");
      }
      setRefreshing(false);
    },
    [eventId]
  );

  useEffect(() => {
    mounted.current = true;
    setStatus(null);
    setError("");
    void refresh();
    const onFocus = () => {
      if (!busy.current) void refresh();
    };
    const onVisible = () => {
      if (!document.hidden) onFocus();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    const poll = window.setInterval(onVisible, 30000);
    return () => {
      mounted.current = false;
      requestVersion.current++;
      window.clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  useEffect(() => {
    if (!status) return;
    // Schedule using durations from server timestamps, never the phone clock.
    const serverTime = Date.parse(status.serverTime);
    const delays = [
      status.clockInOpensAt,
      status.clockInClosesAt,
      status.clockOutClosesAt,
    ]
      .map((time) => Date.parse(time) - serverTime)
      .filter((delay) => delay >= 0);
    if (!delays.length) return;
    const next = Math.min(...delays);
    if (next >= 30000) return;
    const timeout = window.setTimeout(() => {
      if (!busy.current && !document.hidden) void refresh();
    }, next + 100);
    return () => window.clearTimeout(timeout);
  }, [status, refresh]);

  const submit = async () => {
    if (busy.current || refreshing || error || !status) return;
    const checkingOut = Boolean(status.attendance);
    if (!(checkingOut ? status.canClockOut : status.canClockIn)) return;
    busy.current = true;
    setSubmitting(true);
    setError("");
    const version = ++requestVersion.current;
    try {
      const result = await (checkingOut ? clockOutForShift : clockInForShift)(
        eventId
      );
      if (!mounted.current || version !== requestVersion.current) return;
      if ("error" in result) {
        setError(result.error);
      } else {
        // Show the saved record immediately, even if the following GET fails.
        setStatus((previous) =>
          previous
            ? {
                ...previous,
                attendance: result.data.attendance,
                serverTime: result.data.serverTime,
                canClockIn: false,
                canClockOut: false,
              }
            : previous
        );
      }
      // A timed-out request may still have saved. Reconcile before another action.
      await refresh(false);
    } finally {
      busy.current = false;
      if (mounted.current) setSubmitting(false);
    }
  };

  const attendance = status?.attendance;
  const complete = Boolean(attendance?.checkoutTime);
  const canAct = attendance ? status.canClockOut : status?.canClockIn;
  let message = error
    ? "Attendance is unavailable. Refresh to try again."
    : "Loading attendance…";
  if (status) {
    if (complete) message = "Your attendance is recorded.";
    else if (!status.isApproved)
      message = "An approved registration is required to clock in or out.";
    else if (attendance)
      message = status.canClockOut
        ? "Clock out when you leave. Checkout is available until midnight Atlanta time."
        : "Self-checkout is unavailable. Contact an admin to update your attendance.";
    else if (status.canClockIn)
      message = "Ready to volunteer? Clock in when you arrive.";
    else if (Date.parse(status.serverTime) < Date.parse(status.clockInOpensAt))
      message = `Clock-in opens ${formatTime(status.clockInOpensAt)}.`;
    else
      message =
        "The clock-in window has closed. Contact an admin if you need help.";
  }

  return (
    <section
      aria-labelledby="volunteer-clock-title"
      aria-busy={submitting || refreshing}
      className="my-6 w-full rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
    >
      <h2 id="volunteer-clock-title" className="text-xl font-bold">
        Clock In / Clock Out
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        All times are shown in Atlanta time.
      </p>
      <div role="status" aria-live="polite" className="mt-4 space-y-3">
        <p>{message}</p>
        {attendance?.checkinTime && (
          <p>
            <span className="font-semibold">Clocked in: </span>
            <time dateTime={attendance.checkinTime}>
              {formatTime(attendance.checkinTime)}
            </time>
          </p>
        )}
        {attendance?.checkoutTime && (
          <>
            <p>
              <span className="font-semibold">Clocked out: </span>
              <time dateTime={attendance.checkoutTime}>
                {formatTime(attendance.checkoutTime)}
              </time>
            </p>
            <p className="text-lg font-bold">
              Total: {Math.floor(attendance.minutes / 60)} hr{" "}
              {attendance.minutes % 60} min
            </p>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {!complete && status && (
        <button
          type="button"
          onClick={() => {
            void submit();
          }}
          disabled={!canAct || submitting || refreshing || Boolean(error)}
          className="mt-4 min-h-[48px] w-full rounded-lg bg-primaryColor px-4 py-3 font-semibold text-white hover:bg-hoverColor focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
        >
          {submitting
            ? attendance
              ? "Clocking out…"
              : "Clocking in…"
            : attendance
            ? "Clock Out"
            : "Clock In"}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          void refresh();
        }}
        disabled={submitting || refreshing}
        className="mt-3 block min-h-[44px] w-full rounded-lg px-3 py-2 text-sm font-semibold underline focus-visible:outline focus-visible:outline-2 disabled:opacity-50 sm:w-auto"
      >
        {refreshing ? "Refreshing…" : "Refresh status"}
      </button>
    </section>
  );
};

export default VolunteerClock;
