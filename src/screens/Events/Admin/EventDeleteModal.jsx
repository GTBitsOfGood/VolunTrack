import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import { deleteAllRecurringEvents, deleteEvent } from "../../../queries/events";

const EventDeleteModal = ({ open, toggle, event, onEventDelete }) => {
  const [isDeleting, setDeleting] = useState(false);
  const {
    data: { user },
  } = useSession();
  const [hasRecurrence, setHasRecurrence] = useState(
    event.eventParent?.isRecurring?.includes(true) ?? false
  );
  const handleSubmit = (deleteAllRecurrences) => {
    setDeleting(true);
    if (deleteAllRecurrences) {
      deleteAllRecurringEvents(event._id).then(() => {
        toggle();
        setDeleting(false);
        onEventDelete(event._id);
      });
    } else {
      deleteEvent(event._id).then(() => {
        toggle();
        setDeleting(false);
        onEventDelete(event._id);
      });
    }
  };
  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Event</ModalHeader>
      <ModalBody>Are you sure you want to delete this event?</ModalBody>
      <ModalFooter>
        <BoGButton text="Cancel" onClick={toggle} outline={true} />
        <BoGButton
          text="Delete"
          onClick={() => handleSubmit(false)}
          disabled={isDeleting}
        />
        {hasRecurrence && (
          <BoGButton
            text="Delete All Recurrences"
            onClick={() => handleSubmit(true)}
            disabled={isDeleting}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default EventDeleteModal;

EventDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};
