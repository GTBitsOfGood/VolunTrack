import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BoGButton from "./BoGButton";
import PropTypes from "prop-types";
import { updateEvent } from "../screens/Events/eventHelpers";

const EventUnregisterModal = ({ open, toggle, eventData, userId }) => {
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
      <ModalHeader toggle={toggle} />
      <ModalBody>
        Are you sure you want to cancel your registration for this event?
      </ModalBody>
      <ModalFooter>
        <BoGButton text="No, keep it" onClick={toggle} outline={true}/>
        <BoGButton text="Yes, cancel it" onClick={handleSubmit}/>
      </ModalFooter>
    </Modal>
  );
};

EventUnregisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
  userId: PropTypes.object.isRequired,
};
export default EventUnregisterModal;
