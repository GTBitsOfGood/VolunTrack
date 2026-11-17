import PropTypes from "prop-types";
import { formatAtlantaTime } from "../../../utils/dates";
import { useState } from "react";
import { Tooltip } from "flowbite-react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const TimesheetCard = ({ entry, onDelete, isDeleting }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tasksDisplay = entry.tasks.length > 0 ? entry.tasks.join(", ") : "—";
  const toggleDeleteModal = () => setShowDeleteModal((prev) => !prev);
  const handleDelete = async () => {
    await onDelete(entry.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <div className="flex items-start justify-between border-b border-gray-300 pb-3">
        <div>
          <span className="font-bold text-gray-800">Contact Name: </span>
          <span className="text-gray-600">{entry.name}</span>
        </div>
        {onDelete ? (
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
        ) : (
          // Clock records are corrected on the shift's Attendance Management page.
          <span className="text-sm text-gray-500">Clock in/out</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="font-bold text-gray-800">Event </span>
          <span className="text-gray-600">{entry.eventName}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Task(s) </span>
          <span className="text-gray-600">{tasksDisplay}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Date </span>
          <span className="text-gray-600">{entry.date}</span>
        </div>
        <div>
          <span className="font-bold text-gray-800">Start Time </span>
          <span className="text-gray-600">
            {formatAtlantaTime(entry.start)}
          </span>
        </div>
        <div>
          <span className="font-bold text-gray-800">End Time </span>
          <span className="text-gray-600">{formatAtlantaTime(entry.end)}</span>
        </div>
      </div>
      {onDelete && (
        <Modal
          isOpen={showDeleteModal}
          toggle={toggleDeleteModal}
          backdrop="static"
        >
          <ModalHeader toggle={toggleDeleteModal}>
            Delete timesheet entry?
          </ModalHeader>
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
      )}
    </div>
  );
};

TimesheetCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    kind: PropTypes.oneOf(["typed", "clock"]).isRequired,
    name: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    date: PropTypes.string.isRequired,
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func,
  isDeleting: PropTypes.bool,
};

export default TimesheetCard;
