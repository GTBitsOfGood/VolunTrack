import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../../components/Text";
import BoGButton from "../../../components/BoGButton";
import { formatAttendanceTime } from "../../Stats/User/hourParsing";
import {
  getMyAttendance,
  clockInForShift,
  clockOutForShift,
} from "../../../queries/attendances";

const VolunteerLog = ({ eventId, user }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = useRef(false);
  const generation = useRef(0);
  const saving = useRef(false);

  const refresh = useCallback(async () => {
    const request = ++generation.current;
    if (!eventId || !user?._id) return;
    setLoading(true);
    const response = await getMyAttendance(String(eventId));
    if (!active.current || request !== generation.current) return;
    if (response.error || !response.data) {
      setStatus(null);
      setError(response.error || "Could not load attendance. Please refresh.");
    } else {
      setStatus(response.data);
      setError("");
    }
    setLoading(false);
  }, [eventId, user?._id]);

  useEffect(() => {
    active.current = true;
    setStatus(null);
    refresh();
    const onFocus = () => {
      if (!saving.current) refresh();
    };
    window.addEventListener("focus", onFocus);
    const timer = setInterval(onFocus, 30000);
    return () => {
      active.current = false;
      generation.current++;
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const clock = async (action) => {
    if (saving.current || loading) return;
    saving.current = true;
    setBusy(true);
    setError("");
    const response = await action(String(eventId));
    if (active.current) {
      // Always refresh after a write, including a lost response or conflict.
      await refresh();
      if (active.current && response.error) setError(response.error);
      if (active.current) setBusy(false);
    }
    saving.current = false;
  };

  return (
    <div className="mt-8">
      <Text text="Log Hours" type="subheader" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <BoGButton
          type="button"
          text="Clock In"
          onClick={() => clock(clockInForShift)}
          disabled={loading || busy || !status?.canClockIn}
        />
        <BoGButton
          type="button"
          text="Clock Out"
          onClick={() => clock(clockOutForShift)}
          disabled={loading || busy || !status?.canClockOut}
        />
        <button
          type="button"
          className="text-primaryColor underline"
          disabled={loading || busy}
          onClick={refresh}
        >
          Refresh attendance
        </button>
      </div>
      {loading && <p role="status">Loading attendance…</p>}
      {busy && <p role="status">Saving attendance…</p>}
      {error && (
        <p role="alert" className="mt-2 text-red-600">
          {error}
        </p>
      )}
      {!loading && status && !status.attendance && (
        <p className="mt-2 text-sm text-slate-600">
          {status.isApproved
            ? "Clock-in opens 30 minutes before the shift starts and closes when it ends. Times are recorded automatically in Atlanta time."
            : "An approved registration is required to clock in."}
        </p>
      )}
      {status?.attendance && (
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <strong>In:</strong>{" "}
            {formatAttendanceTime(status.attendance.checkinTime)}
          </p>
          <p>
            <strong>Out:</strong>{" "}
            {formatAttendanceTime(status.attendance.checkoutTime)}
          </p>
          {!status.attendance.checkoutTime && !status.canClockOut && (
            <p>
              Clock-out is unavailable. Contact an admin to correct your
              attendance.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

VolunteerLog.propTypes = {
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  user: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
};

export default VolunteerLog;
