import PropTypes from "prop-types";
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
  const handleSubmit = () => {
    unregisterForEvent(eventData._id, userId);
    toggle();
    if (callback) callback();
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
      <ModalHeader toggle={toggle} />
      <ModalBody>
        Are you sure you want to cancel your registration for this event?
      </ModalBody>
      <ModalFooter>
        <BoGButton text="No, keep it" onClick={toggle} outline={true} />
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
