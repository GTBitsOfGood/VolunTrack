import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import PropTypes from "prop-types";
import { updateEvent } from "../screens/Events/eventHelpers";

const EventUnRegisterModal = ({ open, toggle, eventData, userId }) => {
  const handleSubmit = () => {
    onUnregisterClicked(eventData)
      .then(() => {
        toggle();
      })
      .catch(console.log);
  };

  const onUnregisterClicked = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      volunteers: event.volunteers.filter((volunteer) => volunteer !== userId),
    };
    await updateEvent(changedEvent);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        Are you sure you want to cancel your registration for this event?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          No, keep it
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Yes, cancel it
        </Button>
      </ModalFooter>
    </Modal>
  );
};

EventUnRegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
  userId: PropTypes.object.isRequired,
};
export default EventUnRegisterModal;
