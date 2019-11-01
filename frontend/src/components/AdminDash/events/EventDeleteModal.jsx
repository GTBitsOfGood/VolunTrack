import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { deleteEvent } from '../queries';

const EventDeleteModal = ({ open, toggle, event }) => {
  const [isDeleting, setDeleting] = useState(false);

  const handleSubmit = () => {
    deleteEvent(event._id)
      .then(() => {
        setDeleting(true);
        toggle();
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

EventDeleteModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func
};
export default EventDeleteModal;
