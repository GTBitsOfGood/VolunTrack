import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import BoGButton from "../../../../components/BoGButton";
import { deleteAttendance } from "../../../../actions/queries";

// TODO: Test
const EventStatsDeleteModal = ({ open, toggle, event }) => {
  const [isDeleting, setDeleting] = useState(false);

  const handleSubmit = () => {
    setDeleting(true);
    deleteAttendance(event._id, event.eventId)
      .then(() => {
        toggle();
        setDeleting(false);
      })
      .catch(console.log);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Entry</ModalHeader>
      <ModalBody>
        Are you sure you want to delete this entry <strong>permanently</strong>?
      </ModalBody>
      <ModalFooter>
        <BoGButton text="Cancel" onClick={toggle} />
        <BoGButton text="Delete" onClick={handleSubmit} disabled={isDeleting} />
      </ModalFooter>
    </Modal>
  );
};

EventStatsDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object,
};
export default EventStatsDeleteModal;
