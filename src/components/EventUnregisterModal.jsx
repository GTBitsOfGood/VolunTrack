import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { unregisterForEvent } from "../queries/registrations";
import { updateEvent } from "../screens/Events/eventHelpers";
import BoGButton from "./BoGButton";

const EventUnregisterModal = ({
  open,
  toggle,
  eventData,
  userId,
  callback,
}) => {
  const [error, setError] = useState("");

  // Wait for the server: it refuses once the volunteer has clocked in or the
  // shift is over, and that refusal has to stay on screen.
  const handleSubmit = async () => {
    const result = await unregisterForEvent(eventData._id, userId);
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Your registration could not be cancelled. Please try again."
      );
      return;
    }
    setError("");
    toggle();
    if (callback) callback();
  };

  const close = () => {
    setError("");
    toggle();
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
    <Modal isOpen={open} toggle={close} backdrop="static">
      <ModalHeader toggle={close} />
      <ModalBody>
        Are you sure you want to cancel your registration for this event?
        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <BoGButton text="No, keep it" onClick={close} outline={true} />
        <BoGButton text="Yes, cancel it" onClick={handleSubmit} />
      </ModalFooter>
    </Modal>
  );
};

EventUnregisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
  userId: PropTypes.object.isRequired,
  callback: PropTypes.func,
};
export default EventUnregisterModal;
