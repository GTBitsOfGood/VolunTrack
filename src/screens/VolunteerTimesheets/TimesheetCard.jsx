import PropTypes from "prop-types";
import { useState } from "react";
import { Tooltip } from "flowbite-react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

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

const TimesheetCard = ({ log, onDelete, isDeleting }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
  const toggleDeleteModal = () => setShowDeleteModal((prev) => !prev);
  const handleDelete = async () => {
    await onDelete(log._id);
    setShowDeleteModal(false);
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <div className="flex items-start justify-between border-b border-gray-300 pb-3">
        <div>
          <span className="font-bold text-gray-800">Contact Name: </span>
          <span className="text-gray-600">{contactName}</span>
        </div>
        <Tooltip content="Delete" style="light">
          <button
            type="button"
            className="mx-1"
            onClick={toggleDeleteModal}
            aria-label="Delete timesheet entry"
          >
            <TrashIcon className="h-6 text-primaryColor" />
          </button>
        </Tooltip>
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
      <Modal
        isOpen={showDeleteModal}
        toggle={toggleDeleteModal}
        backdrop="static"
      >
        <ModalHeader toggle={toggleDeleteModal}>Delete User?</ModalHeader>
        <ModalBody>
          Please confirm if you want to do this. This cannot be undone.
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={toggleDeleteModal}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
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
    _id: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

export default TimesheetCard;
