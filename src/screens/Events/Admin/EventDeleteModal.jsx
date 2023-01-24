import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { deleteEvent } from "../../../actions/queries";

const EventDeleteModal = ({ open, toggle, event }) => {
  const [isDeleting, setDeleting] = useState(false);
  const {
    data: { user },
  } = useSession();

  const handleSubmit = () => {
    setDeleting(true);
    deleteEvent(event._id, user._id)
      .then(() => {
        toggle();
        setDeleting(false);
      })
      .catch(console.log);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Event</ModalHeader>
      <ModalBody>Are you sure you want to delete this event?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isDeleting}>
          Delete
        </Button>
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
