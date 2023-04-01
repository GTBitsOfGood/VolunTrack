
import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import { deleteEvent } from "../../../queries/events";

const EventDeleteModal = ({ open, toggle, event, onEventDelete }) => {
  const [isDeleting, setDeleting] = useState(false);
  

  const handleSubmit = () => {
    setDeleting(true);
    onEventDelete(event._id);
    deleteEvent(event._id).then(() => {
      toggle();
      setDeleting(false);
    });
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Event</ModalHeader>
      <ModalBody>Are you sure you want to delete this event?</ModalBody>
      <ModalFooter>
        <BoGButton text="Cancel" onClick={toggle} outline={true} />
        <BoGButton text="Delete" onClick={handleSubmit} disabled={isDeleting} />
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
