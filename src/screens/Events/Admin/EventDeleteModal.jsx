import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import { deleteEvent } from "../../../queries/events";

const EventDeleteModal = ({ open, toggle, event, onEventDelete }) => {
  const [isDeleting, setDeleting] = useState(false);
  const {
    data: { user },
  } = useSession();

  const handleSubmit = () => {
    setDeleting(true);
    onEventDelete(event._id, recurringEvent);
    deleteEvent(event._id, recurringEvent).then(() => {
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
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
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
