import PropTypes from "prop-types";

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm} / ${dd} / ${yyyy}`;
};

const formatTime = (date) => {
  if (!date) return "—:—";
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const TimesheetCard = ({ log }) => {
  const contactName =
    log.userId?.firstName != null && log.userId?.lastName != null
      ? `${log.userId.firstName} ${log.userId.lastName}`
      : "—";
  const eventName = log.eventId?.eventParent?.title ?? "—";
  const tasks = log.eventId?.eventParent?.tasks ?? [];
  const tasksDisplay = Array.isArray(tasks) ? tasks.join(", ") : "—";
  const date = log.eventId?.date ?? log.inTime;
  const startTime = log.inTime;
  const endTime = log.outTime;

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <div className="border-b border-gray-300 pb-3">
        <span className="font-bold text-gray-800">Contact Name: </span>
        <span className="text-gray-600">{contactName}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="font-bold text-gray-800">Event </span>
          <span className="text-gray-600">{eventName}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Task(s) </span>
          <span className="text-gray-600">{tasksDisplay || "—"}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Date </span>
          <span className="text-gray-600">{formatDate(date)}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Start Time </span>
          <span className="text-gray-600">{formatTime(startTime)}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">End Time </span>
          <span className="text-gray-600">{formatTime(endTime)}</span>
        </div>
      </div>
    </div>
  );
};

TimesheetCard.propTypes = {
  log: PropTypes.shape({
    userId: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    eventId: PropTypes.shape({
      date: PropTypes.string,
      eventParent: PropTypes.shape({
        title: PropTypes.string,
        tasks: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
    inTime: PropTypes.string,
    outTime: PropTypes.string,
  }).isRequired,
};

export default TimesheetCard;
