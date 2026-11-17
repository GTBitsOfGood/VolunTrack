import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import { getAttendances } from "../../../queries/attendances";
import { deleteEvent } from "../../../queries/events";

const EventDeleteModal = ({ open, toggle, event, onEventDelete }) => {
  const [isDeleting, setDeleting] = useState(false);
  const [clockRecordCount, setClockRecordCount] = useState(0);
  const {
    data: { user },
  } = useSession();

  // Deleting a shift also deletes its clock records, so warn when it has any.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setClockRecordCount(0);
    getAttendances({ eventId: event._id }).then((result) => {
      if (!cancelled)
        setClockRecordCount(result?.data?.attendances?.length ?? 0);
    });
    return () => {
      cancelled = true;
    };
  }, [open, event._id]);

  const handleSubmit = () => {
    setDeleting(true);
    deleteEvent(event._id, recurringEvent).then(() => {
      // After the server deleted it, so the list and week box reload the truth.
      onEventDelete(event._id, recurringEvent);
      toggle();
      setDeleting(false);
    });
  };

  const [recurringEventConfirm, setRecurringEventConfirm] = useState(
    event.recurringEvents > 0 ? false : true
  );

  const [recurringEvent, setRecurringEvent] = useState(false);

  useEffect(() => {
    setRecurringEventConfirm(event.recurringEvents > 0 ? false : true);
  }, [open]);

  return (
    <Modal
      style={
        !recurringEventConfirm && event.recurringEvents > 0
          ? { maxWidth: "300px" }
          : {}
      }
      isOpen={open}
      toggle={toggle}
      backdrop="static"
    >
      {!recurringEventConfirm && event.recurringEvents > 0 && (
        <div>
          <ModalBody>
            <div className="flex flex-col gap-8 px-3 py-2">
              <span className="text-xl font-bold">Delete Recurring Event</span>
              <div className="flex flex-col gap-4 pl-2">
                <div
                  onClick={() => setRecurringEvent(false)}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                    {!recurringEvent && (
                      <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                    )}
                  </div>
                  <span>This event</span>
                </div>
                <div
                  onClick={() => setRecurringEvent(true)}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                    {recurringEvent && (
                      <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                    )}
                  </div>
                  <span>This and future events</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <BoGButton
                  text="Cancel"
                  onClick={() => {
                    toggle();
                    setRecurringEventConfirm(false);
                  }}
                  outline={true}
                />
                <BoGButton
                  text="Confirm"
                  onClick={() => setRecurringEventConfirm(true)}
                  disabled={isDeleting}
                />
              </div>
            </div>
          </ModalBody>
        </div>
      )}
      {recurringEventConfirm && (
        <div>
          <ModalHeader toggle={toggle}>Delete Event</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this event?
            {clockRecordCount > 0 && (
              <p role="alert" className="mt-3 font-semibold text-red-600">
                {clockRecordCount === 1
                  ? "1 volunteer has clocked in for this shift. Deleting it also deletes that clock record and its hours."
                  : `${clockRecordCount} volunteers have clocked in for this shift. Deleting it also deletes their clock records and hours.`}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <BoGButton
              text="Cancel"
              onClick={() => {
                toggle();
                setRecurringEventConfirm(false);
              }}
              outline={true}
            />
            <BoGButton
              text="Delete"
              onClick={handleSubmit}
              disabled={isDeleting}
            />
          </ModalFooter>
        </div>
      )}
    </Modal>
  );
};

export default EventDeleteModal;

EventDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};
