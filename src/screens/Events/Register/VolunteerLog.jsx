import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../../components/Text";
import BoGButton from "../../../components/BoGButton";

const VolunteerLog = ({ eventId, user }) => {
  const [logs, setLogs] = useState([]);
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId || !user?._id) return;

    axios
      .get("/api/volunteer-logs", {
        params: { eventId, userId: user._id },
      })
      .then((response) => {
        if (response?.data?.logs) {
          setLogs(response.data.logs);
        }
      })
      .catch(() => {
        // Silently ignore fetch errors; logging is best-effort.
      });
  }, [eventId, user?._id]);

  const hasExistingLog = logs.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (hasExistingLog) return;
    if (!inTime || !outTime) {
      setError("Please provide both start and end times.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/volunteer-logs", {
        eventId,
        userId: user._id,
        inTime,
        outTime,
      });

      if (response?.data?.log) {
        setLogs([response.data.log]);
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        "Unable to save your volunteer hours. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <Text text="Log Hours" type="subheader" />

      <form
        className="mt-3 flex flex-row items-center gap-3"
        onSubmit={handleSubmit}
      >
          <span className="text-sm font-semibold text-slate-700">In:</span>
          <input
          type="time"
            className="h-9 rounded-md border border-gray-300 px-2 text-sm"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
          />
          <span className="text-sm font-semibold text-slate-700">Out:</span>
          <input
          type="time"
            className="h-9 rounded-md border border-gray-300 px-2 text-sm"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
          />
          <BoGButton
            type="submit"
            text="Save"
          className="ml-2 bg-primaryColor font-semibold hover:bg-hoverColor"
          disabled={isSubmitting || hasExistingLog}
          />
          {error && (
            <Text
              className="ml-3 text-sm font-semibold text-red-600"
              text={error}
            />
          )}
      </form>

      {hasExistingLog && logs[0] && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="w-56 rounded-md bg-gray-200 px-4 py-2 text-sm text-black">
            <span className="mr-2 font-semibold">Out</span>
            <span>
              {new Date(logs[0].outTime).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="w-56 rounded-md bg-gray-200 px-4 py-2 text-sm text-black">
            <span className="mr-2 font-semibold">In</span>
            <span>
              {new Date(logs[0].inTime).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
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

