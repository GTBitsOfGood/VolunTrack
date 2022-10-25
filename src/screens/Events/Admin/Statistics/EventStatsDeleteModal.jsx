import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import PropTypes from "prop-types";
import { deleteAttendance } from "../../../../actions/queries";

const EventStatsDeleteModal = ({ open, toggle, event }) => {
  const [isDeleting, setDeleting] = useState(false);

  const handleSubmit = () => {
    setDeleting(true);
    deleteAttendance(event._id, event.eventId)
      .then((result) => {
        console.log(result);
        toggle();
        setDeleting(false);
      })
      .catch(console.log);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Entry</ModalHeader>
      <ModalBody>Are you sure you want to delete this entry?</ModalBody>
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

EventStatsDeleteModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};
export default EventStatsDeleteModal;
